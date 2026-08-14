import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { socket } from './socket';
import {
  handAtom,
  opponentCardAtom,
  turnResultAtom,
  player1ScoreAtom,
  player2ScoreAtom,
  gameFinishedAtom,
  winnerAtom,
  playedCardIdsAtom,
  selectedCardAtom,
  guessAtom,
  notificationModalAtom,
} from '../store/game';

/**
 * App.tsxのトップレベルで1度だけ呼び出し、サーバーからのイベントを
 * Jotai atomの更新 + 画面遷移(React Router)に変換する。
 * 各Pageコンポーネント側では atom を読むだけでよく、socket.onを個別に書かない。
 */
export function useGameSync() {
  const navigate = useNavigate();
  const setHand = useSetAtom(handAtom);
  const setOpponentCard = useSetAtom(opponentCardAtom);
  const setTurnResult = useSetAtom(turnResultAtom);
  const setPlayer1Score = useSetAtom(player1ScoreAtom);
  const setPlayer2Score = useSetAtom(player2ScoreAtom);
  const setGameFinished = useSetAtom(gameFinishedAtom);
  const setWinner = useSetAtom(winnerAtom);
  const setPlayedCardIds = useSetAtom(playedCardIdsAtom);
  const setSelectedCard = useSetAtom(selectedCardAtom);
  const setGuess = useSetAtom(guessAtom);
  const setNotificationModal = useSetAtom(notificationModalAtom);

  useEffect(() => {
    socket.on('room:waitingForOpponent', () => {
      navigate('/matching');
    });

    socket.on('game:start', ({ hand }) => {
      // 新規ゲーム開始(再戦時も含む)なので、前回分の状態をすべてリセットしておく
      setHand(hand);
      setPlayedCardIds([]);
      setSelectedCard(null);
      setOpponentCard(null);
      setGuess(null);
      setTurnResult(null);
      setGameFinished(false);
      setWinner(null);
      setPlayer1Score(0);
      setPlayer2Score(0);
      navigate('/meaning-input');
    });

    socket.on('battle:yourTurn', () => {
      navigate('/battle');
    });

    socket.on('battle:waitOpponentPlay', () => {
      navigate('/waiting');
    });

    socket.on('guess:opponentPlayed', ({ card }) => {
      setOpponentCard(card);
      navigate('/guess');
    });

    socket.on('turn:result', (result) => {
      setTurnResult(result);
      setPlayer1Score(result.playerScore);
      setPlayer2Score(result.opponentScore);
      navigate('/turn-result');
    });

    socket.on('game:end', ({ winner, player1Score, player2Score }) => {
      setGameFinished(true);
      setWinner(winner);
      setPlayer1Score(player1Score);
      setPlayer2Score(player2Score);
      navigate('/result');
    });

    socket.on('opponent:disconnected', () => {
      setNotificationModal({
        isOpen: true,
        title: '対戦中断',
        message: '対戦相手の通信接続が切断されました。タイトル画面へ戻ります。',
        buttonText: 'タイトル画面へ戻る',
      });
    });

    return () => {
      socket.off('room:waitingForOpponent');
      socket.off('game:start');
      socket.off('battle:yourTurn');
      socket.off('battle:waitOpponentPlay');
      socket.off('guess:opponentPlayed');
      socket.off('turn:result');
      socket.off('game:end');
      socket.off('opponent:disconnected');
    };
  }, [
    navigate,
    setHand,
    setOpponentCard,
    setTurnResult,
    setPlayer1Score,
    setPlayer2Score,
    setGameFinished,
    setWinner,
    setPlayedCardIds,
    setSelectedCard,
    setGuess,
  ]);
}
