import type { Card, Guess, PlayerNumber } from '../types/game';
import { pickRealWord, generateFakeWords } from '../words/wordBank';
import type { Room, PlayerSlot } from '../rooms/roomManager';

let cardIdSeq = 1;

/**
 * プレイヤー1人分の手札(本物1枚+偽物3枚)を生成する。
 * 偽物カードのmeaningは空文字(MeaningInputPageでプレイヤーが入力する)。
 */
export async function generateHand(ownerId: string): Promise<Card[]> {
  const real = await pickRealWord();
  const fakeWords = await generateFakeWords(3, [real.word]);

  const realCard: Card = {
    id: cardIdSeq++,
    word: real.word,
    meaning: real.meaning,
    isReal: true,
    isOpened: false,
    ownerId,
  };

  const fakeCards: Card[] = fakeWords.map((word) => ({
    id: cardIdSeq++,
    word,
    meaning: '', // プレイヤーが後で入力
    isReal: false,
    isOpened: false,
    ownerId,
  }));

  return [realCard, ...fakeCards];
}

/**
 * 得点表(要件定義書 5章)に基づいて得点を計算する。
 * @param isReal 出されたカードが本物かどうか
 * @param guess 回答者の回答
 * @returns { point, awardTo } pointは加算点、awardToはどちらのプレイヤーに加点するか
 */
export function calcScore(
  isReal: boolean,
  guess: Guess,
  shower: PlayerNumber,
  guesser: PlayerNumber,
): { correct: boolean; point: number; awardTo: PlayerNumber | null } {
  if (isReal && guess === 'real') {
    // 本物カード・正しくリアルと見抜かれた -> 回答者+3点
    return { correct: true, point: 3, awardTo: guesser };
  }
  if (isReal && guess === 'fake') {
    // 本物カード・誤って偽物と判定 -> 得点なし
    return { correct: false, point: 0, awardTo: null };
  }
  if (!isReal && guess === 'real') {
    // 偽物カード・騙されてリアルと判定 -> 出題者+2点
    return { correct: false, point: 2, awardTo: shower };
  }
  // 偽物カード・見破られた -> 回答者+1点
  return { correct: true, point: 1, awardTo: guesser };
}

/** 次のターンで「出す側(出題者)」になるプレイヤーを決める。ターンごとに交互 */
export function nextShower(turn: number): PlayerNumber {
  // turn: 0-indexed。偶数ターンはPlayer1が出題、奇数ターンはPlayer2が出題
  return turn % 2 === 0 ? 1 : 2;
}

export function isGameFinished(room: Room): boolean {
  // 各プレイヤー4枚ずつ、合計8ターン消化で終了
  return room.turn >= 8;
}

export function findPlayer(room: Room, playerNumber: PlayerNumber): PlayerSlot | undefined {
  return room.players.find((p) => p.playerNumber === playerNumber);
}
