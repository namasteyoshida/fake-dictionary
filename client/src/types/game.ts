// server/src/types/game.ts と同じ契約。
// モノレポ化する際はここを shared/ パッケージに切り出して両方から参照する想定。

export type HandCard = {
  id: number;
  word: string;
  meaning: string; // 本物: 最初から入っている / 偽物: 未入力なら空文字
  isReal: boolean;
  isOpened: boolean;
};

export type RevealedCard = {
  word: string;
  meaning: string;
};

export type Guess = 'real' | 'fake';

export type TurnResult = {
  correct: boolean;
  point: number;
  playerScore: number;
  opponentScore: number;
  isReal: boolean;
};

export type PlayerNumber = 1 | 2;

export type CreateRoomResult = { roomId: string; playerNumber: PlayerNumber };
export type JoinRoomResult =
  | { ok: true; playerNumber: PlayerNumber }
  | { ok: false; reason: 'ROOM_NOT_FOUND' | 'ROOM_FULL' };

export type GameStartPayload = { hand: HandCard[] };
export type SubmitMeaningsPayload = { meanings: { cardId: number; meaning: string }[] };
export type PlayCardPayload = { cardId: number };
export type OpponentPlayedPayload = { card: RevealedCard };
export type SubmitGuessPayload = { guess: Guess };
export type GameEndPayload = { winner: PlayerNumber | 'draw'; player1Score: number; player2Score: number };

export interface ClientToServerEvents {
  'room:create': (payload: Record<string, never>, cb: (res: CreateRoomResult) => void) => void;
  'room:join': (payload: { roomId: string }, cb: (res: JoinRoomResult) => void) => void;
  'matching:auto': (payload: Record<string, never>) => void;
  'meaning:submit': (payload: SubmitMeaningsPayload) => void;
  'battle:playCard': (payload: PlayCardPayload) => void;
  'guess:submit': (payload: SubmitGuessPayload) => void;
  'game:restart': () => void;
}

export interface ServerToClientEvents {
  'room:waitingForOpponent': () => void;
  'game:start': (payload: GameStartPayload) => void;
  'meaning:waitingForOpponent': () => void;
  'battle:yourTurn': () => void;
  'battle:waitOpponentPlay': () => void;
  'guess:opponentPlayed': (payload: OpponentPlayedPayload) => void;
  'turn:result': (payload: TurnResult) => void;
  'game:end': (payload: GameEndPayload) => void;
  'opponent:disconnected': () => void;
  error: (payload: { message: string }) => void;
}
