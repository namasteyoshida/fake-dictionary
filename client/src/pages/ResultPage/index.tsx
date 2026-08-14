import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { socket } from '../../socket/socket';
import { winnerAtom, player1ScoreAtom, player2ScoreAtom, roomIdAtom, playerNumberAtom, handAtom, playedCardIdsAtom } from '../../store/game';

export function ResultPage() {
  const navigate = useNavigate();
  const winner = useAtomValue(winnerAtom);
  const player1Score = useAtomValue(player1ScoreAtom);
  const player2Score = useAtomValue(player2ScoreAtom);

  const setRoomId = useSetAtom(roomIdAtom);
  const setPlayerNumber = useSetAtom(playerNumberAtom);
  const setHand = useSetAtom(handAtom);
  const setPlayedCardIds = useSetAtom(playedCardIdsAtom);

  function handleRestart() {
    socket.emit('game:restart');
  }

  function handleGoHome() {
    if (socket.connected) {
      socket.disconnect();
    }
    setRoomId(null);
    setPlayerNumber(null);
    setHand([]);
    setPlayedCardIds([]);
    navigate('/');
  }

  const winnerLabel = winner === 'draw' ? '引き分け' : winner ? `Player${winner}の勝ち！` : '';

  return (
    <PageLayout title="結果発表">
      <p className="result-page__winner">{winnerLabel}</p>
      <p className="score-row">
        Player1: {player1Score}点 / Player2: {player2Score}点
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '16px' }}>
        <Button onClick={handleRestart}>もう一度対戦する</Button>
        <Button variant="secondary" onClick={handleGoHome}>
          タイトルへ戻る
        </Button>
      </div>
    </PageLayout>
  );
}

