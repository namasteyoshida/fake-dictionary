import { atom } from 'jotai';
import type { HandCard, RevealedCard, Guess, PlayerNumber, TurnResult } from '../types/game';

// ルーム情報
export const roomIdAtom = atom<string | null>(null);
export const playerNumberAtom = atom<PlayerNumber | null>(null);

// 自分の手札(4枚: 本物1+偽物3)。サーバーから配布された時点の状態を保持
export const handAtom = atom<HandCard[]>([]);

// 意味入力フォームの入力中の値(偽物カードの分のみ使用)
export const meaningsAtom = atom<{ cardId: number; meaning: string }[]>([]);

// Battle画面で選択中のカードid
export const selectedCardAtom = atom<number | null>(null);

// 自分が使用済みのカードid一覧
export const playedCardIdsAtom = atom<number[]>([]);

// 相手が出したカード(Guess画面で表示する用)
export const opponentCardAtom = atom<RevealedCard | null>(null);

// 回答(Guess画面での選択)
export const guessAtom = atom<Guess | null>(null);

// 得点(プレイヤー番号で固定。ターンごとの出題者/回答者交代に影響されない)
export const player1ScoreAtom = atom<number>(0);
export const player2ScoreAtom = atom<number>(0);

// 直近のターン結果
export const turnResultAtom = atom<TurnResult | null>(null);

// 現在の消化ターン数(0-indexed)
export const turnAtom = atom<number>(0);

// 現在「カードを出す側」のプレイヤー番号
export const currentPlayerAtom = atom<PlayerNumber>(1);

// ゲーム終了判定
export const gameFinishedAtom = atom<boolean>(false);
export const winnerAtom = atom<PlayerNumber | 'draw' | null>(null);

// 通知モーダルの表示状態
export interface NotificationModalState {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
}

export const notificationModalAtom = atom<NotificationModalState>({
  isOpen: false,
  title: '',
  message: '',
  buttonText: 'タイトルへ戻る',
});

