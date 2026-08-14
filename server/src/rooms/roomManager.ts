import { randomUUID } from 'crypto';
import type { Card, PlayerNumber, RoomStatus, TurnResult } from '../types/game';

export type PlayerSlot = {
  socketId: string;
  playerNumber: PlayerNumber;
  hand: Card[]; // このプレイヤーの4枚(本物1+偽物3)
  score: number;
  meaningsSubmitted: boolean; // 意味入力(偽物カード3枚分)を完了したか
};

/** 現在出題されている(相手に見せている)カードの情報。回答判定時に参照する */
export type ActiveCard = {
  cardId: number;
  word: string;
  meaning: string;
  isReal: boolean;
};

export type Room = {
  id: string;
  status: RoomStatus;
  players: PlayerSlot[]; // 最大2人
  turn: number; // 現在の消化ターン数(0-indexed、最大8)
  currentPlayer: PlayerNumber; // 現在カードを出す側(出題者)
  playedCardIds: number[]; // 使用済みカードid(全体)
  activeCard: ActiveCard | null;
  lastResult?: TurnResult;
};

const rooms = new Map<string, Room>();
const waitingQueue: string[] = []; // 自動マッチング待ちのroomId

function createEmptyRoom(): Room {
  const id = randomUUID().slice(0, 8); // 短めのID(URL共有用)
  const room: Room = {
    id,
    status: 'waiting',
    players: [],
    turn: 0,
    currentPlayer: 1,
    playedCardIds: [],
    activeCard: null,
  };
  rooms.set(id, room);
  return room;
}

export function createRoom(): Room {
  return createEmptyRoom();
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

export function joinRoom(roomId: string, socketId: string): { room: Room; playerNumber: PlayerNumber } | null {
  const room = rooms.get(roomId);
  if (!room) return null;
  if (room.players.length >= 2) return null;

  const playerNumber: PlayerNumber = room.players.length === 0 ? 1 : 2;
  room.players.push({ socketId, playerNumber, hand: [], score: 0, meaningsSubmitted: false });
  return { room, playerNumber };
}

/** 自動マッチング: 空いている部屋があれば入室、なければ新規作成して待機列へ */
export function autoMatch(socketId: string): { room: Room; playerNumber: PlayerNumber } {
  const waitingRoomId = waitingQueue.shift();
  if (waitingRoomId) {
    const result = joinRoom(waitingRoomId, socketId);
    if (result) return result;
  }

  const room = createEmptyRoom();
  const result = joinRoom(room.id, socketId)!;
  waitingQueue.push(room.id);
  return result;
}

export function getRoomBySocketId(socketId: string): Room | undefined {
  for (const room of rooms.values()) {
    if (room.players.some((p) => p.socketId === socketId)) return room;
  }
  return undefined;
}

export function getPlayerBySocketId(room: Room, socketId: string): PlayerSlot | undefined {
  return room.players.find((p) => p.socketId === socketId);
}

export function opponentOf(playerNumber: PlayerNumber): PlayerNumber {
  return playerNumber === 1 ? 2 : 1;
}

/** 再戦時に部屋を初期状態(手札配布前)に戻す。プレイヤーの接続自体は維持する */
export function resetRoomForRestart(room: Room): void {
  room.status = 'meaningInput';
  room.turn = 0;
  room.currentPlayer = 1;
  room.playedCardIds = [];
  room.activeCard = null;
  room.lastResult = undefined;
  for (const player of room.players) {
    player.score = 0;
    player.meaningsSubmitted = false;
    player.hand = [];
  }
}

export function removePlayerBySocketId(socketId: string): void {
  for (const [roomId, room] of rooms) {
    const idx = room.players.findIndex((p) => p.socketId === socketId);
    if (idx !== -1) {
      room.players.splice(idx, 1);
      const queueIdx = waitingQueue.indexOf(roomId);
      if (queueIdx !== -1) waitingQueue.splice(queueIdx, 1);
      if (room.players.length === 0) rooms.delete(roomId);
    }
  }
}
