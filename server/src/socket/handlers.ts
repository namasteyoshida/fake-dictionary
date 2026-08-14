import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, HandCard, TurnResultPayload } from '../types/game';
import * as roomManager from '../rooms/roomManager';
import type { Room } from '../rooms/roomManager';
import * as gameEngine from '../game/gameEngine';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

// ターン結果画面を表示しておく時間(この間に両者が結果を確認する)
const TURN_RESULT_DISPLAY_MS = 3000;

function toHandCard(card: { id: number; word: string; meaning: string; isReal: boolean; isOpened: boolean }): HandCard {
  return { id: card.id, word: card.word, meaning: card.meaning, isReal: card.isReal, isOpened: card.isOpened };
}

/** 部屋の両プレイヤーが揃ったら、手札を配ってゲームを開始する */
async function startGameIfReady(io: TypedServer, roomId: string) {
  const room = roomManager.getRoom(roomId);
  if (!room || room.players.length !== 2) return;

  room.status = 'meaningInput';
  for (const player of room.players) {
    player.hand = await gameEngine.generateHand(player.socketId);
    io.to(player.socketId).emit('game:start', { hand: player.hand.map(toHandCard) });
  }
}

/** 現在のroom.currentPlayerに従って、出題者にはbattle:yourTurn、回答者にはbattle:waitOpponentPlayを送る */
function startBattlePhase(io: TypedServer, room: Room) {
  room.status = 'battle';
  room.activeCard = null;

  const shower = gameEngine.findPlayer(room, room.currentPlayer);
  const guesser = gameEngine.findPlayer(room, roomManager.opponentOf(room.currentPlayer));
  if (!shower || !guesser) return;

  io.to(shower.socketId).emit('battle:yourTurn');
  io.to(guesser.socketId).emit('battle:waitOpponentPlay');
}

/** ゲーム終了判定を行い、終了していれば game:end を送る。終了していなければ次ターンを開始する */
function advanceAfterResult(io: TypedServer, room: Room) {
  if (gameEngine.isGameFinished(room)) {
    room.status = 'finished';
    const player1 = gameEngine.findPlayer(room, 1);
    const player2 = gameEngine.findPlayer(room, 2);
    const player1Score = player1?.score ?? 0;
    const player2Score = player2?.score ?? 0;
    const winner = player1Score === player2Score ? 'draw' : player1Score > player2Score ? 1 : 2;

    for (const player of room.players) {
      io.to(player.socketId).emit('game:end', { winner, player1Score, player2Score });
    }
    return;
  }

  room.currentPlayer = gameEngine.nextShower(room.turn);
  startBattlePhase(io, room);
}

export function registerHandlers(io: TypedServer, socket: TypedSocket) {
  socket.on('room:create', (_payload, cb) => {
    const room = roomManager.createRoom();
    const result = roomManager.joinRoom(room.id, socket.id)!;
    socket.join(room.id);
    cb({ roomId: room.id, playerNumber: result.playerNumber });
  });

  socket.on('room:join', (payload, cb) => {
    const result = roomManager.joinRoom(payload.roomId, socket.id);
    if (!result) {
      const room = roomManager.getRoom(payload.roomId);
      cb({ ok: false, reason: room ? 'ROOM_FULL' : 'ROOM_NOT_FOUND' });
      return;
    }
    socket.join(payload.roomId);
    cb({ ok: true, playerNumber: result.playerNumber });
    void startGameIfReady(io, payload.roomId);
  });

  socket.on('matching:auto', () => {
    const { room, playerNumber } = roomManager.autoMatch(socket.id);
    socket.join(room.id);
    if (room.players.length < 2) {
      socket.emit('room:waitingForOpponent');
    } else {
      void startGameIfReady(io, room.id);
    }
  });

  socket.on('meaning:submit', (payload) => {
    const room = roomManager.getRoomBySocketId(socket.id);
    const player = room && roomManager.getPlayerBySocketId(room, socket.id);
    if (!room || !player) return;
    if (room.status !== 'meaningInput') return;

    // 偽物カードにプレイヤーが入力した意味を反映する
    for (const { cardId, meaning } of payload.meanings) {
      const card = player.hand.find((c) => c.id === cardId && !c.isReal);
      if (card) card.meaning = meaning;
    }
    player.meaningsSubmitted = true;

    const bothSubmitted = room.players.length === 2 && room.players.every((p) => p.meaningsSubmitted);
    if (bothSubmitted) {
      room.currentPlayer = gameEngine.nextShower(room.turn); // turn=0なのでPlayer1から
      startBattlePhase(io, room);
    }
  });

  socket.on('battle:playCard', (payload) => {
    const room = roomManager.getRoomBySocketId(socket.id);
    const player = room && roomManager.getPlayerBySocketId(room, socket.id);
    if (!room || !player) return;
    if (room.status !== 'battle') return;
    if (player.playerNumber !== room.currentPlayer) return; // 出題者以外は出せない

    const card = player.hand.find((c) => c.id === payload.cardId);
    if (!card || card.isOpened) return; // 存在しない/使用済みカードは弾く

    card.isOpened = true;
    room.playedCardIds.push(card.id);
    room.activeCard = { cardId: card.id, word: card.word, meaning: card.meaning, isReal: card.isReal };
    room.status = 'guessing';

    const guesser = gameEngine.findPlayer(room, roomManager.opponentOf(room.currentPlayer));
    if (!guesser) return;

    // 出題者本人は回答が出るまで待機画面へ
    socket.emit('battle:waitOpponentPlay');
    // 回答者には単語と意味だけを渡す(isRealは種明かしまで隠す)
    io.to(guesser.socketId).emit('guess:opponentPlayed', {
      card: { word: card.word, meaning: card.meaning },
    });
  });

  socket.on('guess:submit', (payload) => {
    const room = roomManager.getRoomBySocketId(socket.id);
    const guesser = room && roomManager.getPlayerBySocketId(room, socket.id);
    if (!room || !guesser || !room.activeCard) return;
    if (room.status !== 'guessing') return;
    if (guesser.playerNumber === room.currentPlayer) return; // 出題者は回答できない

    const shower = gameEngine.findPlayer(room, room.currentPlayer);
    if (!shower) return;

    const { correct, point, awardTo } = gameEngine.calcScore(
      room.activeCard.isReal,
      payload.guess,
      shower.playerNumber,
      guesser.playerNumber,
    );

    if (awardTo !== null) {
      const awarded = gameEngine.findPlayer(room, awardTo);
      if (awarded) awarded.score += point;
    }

    const player1 = gameEngine.findPlayer(room, 1);
    const player2 = gameEngine.findPlayer(room, 2);
    const result: TurnResultPayload = {
      correct,
      point,
      playerScore: player1?.score ?? 0,
      opponentScore: player2?.score ?? 0,
      isReal: room.activeCard.isReal,
    };
    room.lastResult = result;
    room.status = 'turnResult';
    room.turn += 1;

    for (const p of room.players) {
      io.to(p.socketId).emit('turn:result', result);
    }

    // 両者が結果を見る時間を確保してから次のフェーズへ進む(進行はサーバー主導)
    setTimeout(() => advanceAfterResult(io, room), TURN_RESULT_DISPLAY_MS);
  });

  socket.on('game:restart', () => {
    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room || room.players.length !== 2) return;

    roomManager.resetRoomForRestart(room);
    void startGameIfReady(io, room.id);
  });

  socket.on('disconnect', () => {
    const room = roomManager.getRoomBySocketId(socket.id);
    if (room) {
      const opponent = room.players.find((p) => p.socketId !== socket.id);
      if (opponent) io.to(opponent.socketId).emit('opponent:disconnected');
    }
    roomManager.removePlayerBySocketId(socket.id);
  });
}
