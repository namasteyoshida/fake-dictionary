// ========================================
// ゲーム内の基本データ型
// ========================================

/** サーバーが保持する「カードの完全な情報」。isReal・meaningなど全てを含む */
export type Card = {
  id: number;
  word: string;
  meaning: string; // 本物カード: 辞書の正しい意味 / 偽物カード: プレイヤーが入力した意味
  isReal: boolean;
  isOpened: boolean; // このターンで既に相手に見せた(使用済み)か
  ownerId: string; // プレイヤーID
};

/** クライアントに送ってよい「意味入力前の手札」情報(自分の手札用。meaningは偽物のみ空) */
export type HandCard = Pick<Card, 'id' | 'word' | 'isReal' | 'isOpened'> & {
  meaning: string; // 本物は辞書の意味が最初から入っている。偽物は入力されるまで空文字
};

/** 相手に見せるカードの情報(word/meaningのみ。isRealは結果発表まで隠す) */
export type RevealedCard = {
  word: string;
  meaning: string;
};

export type Guess = 'real' | 'fake';

export type TurnResult = {
  correct: boolean;
  point: number;
  playerScore: number; // player1の得点
  opponentScore: number; // player2の得点
  isReal: boolean; // 種明かし
};

export type PlayerNumber = 1 | 2;

export type RoomStatus =
  | 'waiting' // マッチング待機中
  | 'meaningInput' // 意味入力フェーズ
  | 'battle' // カード選択待ち
  | 'guessing' // 相手が回答中
  | 'turnResult' // ターン結果表示中
  | 'finished'; // ゲーム終了

// ========================================
// Socket.io イベント定義
// C2S = Client -> Server / S2C = Server -> Client
// ========================================

export type CreateRoomPayload = Record<string, never>;
export type CreateRoomResult = { roomId: string; playerNumber: PlayerNumber };

export type JoinRoomPayload = { roomId: string };
export type JoinRoomResult =
  | { ok: true; playerNumber: PlayerNumber }
  | { ok: false; reason: 'ROOM_NOT_FOUND' | 'ROOM_FULL' };

export type AutoMatchPayload = Record<string, never>;

export type GameStartPayload = {
  hand: HandCard[]; // 自分の手札4枚(本物1+偽物3)
};

export type SubmitMeaningsPayload = {
  meanings: { cardId: number; meaning: string }[]; // 偽物カード3枚分の意味
};

export type PlayCardPayload = { cardId: number };

/** 出題者ではない側(回答者)に送られる、今出されたカードの情報 */
export type OpponentPlayedPayload = {
  card: RevealedCard;
};

export type SubmitGuessPayload = { guess: Guess };

export type TurnResultPayload = TurnResult;

export type GameEndPayload = {
  winner: PlayerNumber | 'draw';
  player1Score: number;
  player2Score: number;
};

export type ErrorPayload = { message: string };

// クライアント -> サーバー イベント名とペイロードの対応
export interface ClientToServerEvents {
  'room:create': (payload: CreateRoomPayload, cb: (res: CreateRoomResult) => void) => void;
  'room:join': (payload: JoinRoomPayload, cb: (res: JoinRoomResult) => void) => void;
  'matching:auto': (payload: AutoMatchPayload) => void;
  'meaning:submit': (payload: SubmitMeaningsPayload) => void;
  'battle:playCard': (payload: PlayCardPayload) => void;
  'guess:submit': (payload: SubmitGuessPayload) => void;
  'game:restart': () => void;
}

// サーバー -> クライアント イベント名とペイロードの対応
export interface ServerToClientEvents {
  'room:waitingForOpponent': () => void;
  'game:start': (payload: GameStartPayload) => void;
  'meaning:waitingForOpponent': () => void;
  'battle:yourTurn': () => void; // 自分がカードを出す番
  'battle:waitOpponentPlay': () => void; // 相手がカードを出す番(待機画面へ)
  'guess:opponentPlayed': (payload: OpponentPlayedPayload) => void; // 自分が回答する番
  'turn:result': (payload: TurnResultPayload) => void;
  'game:end': (payload: GameEndPayload) => void;
  'opponent:disconnected': () => void;
  'error': (payload: ErrorPayload) => void;
}
