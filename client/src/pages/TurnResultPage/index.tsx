import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { PageLayout } from '../../components/common/PageLayout';
import { Stamp } from '../../components/common/Stamp';
import { turnResultAtom, player1ScoreAtom, player2ScoreAtom } from '../../store/game';
import { sound } from '../../utils/sound';

export function TurnResultPage() {
  const result = useAtomValue(turnResultAtom);
  const player1Score = useAtomValue(player1ScoreAtom);
  const player2Score = useAtomValue(player2ScoreAtom);

  useEffect(() => {
    if (!result) return;
    if (result.correct) {
      sound.playWin();
    } else {
      sound.playLose();
    }
  }, [result]);

  if (!result) {
    return (
      <PageLayout title="ターン結果">
        <p>結果を読み込んでいます…</p>
      </PageLayout>
    );
  }


  return (
    <PageLayout title={result.correct ? '正解！' : '不正解…'}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Stamp isReal={result.isReal} />
      </div>
      <p>獲得ポイント: {result.point}</p>
      <p className="score-row">
        Player1: {player1Score}点 / Player2: {player2Score}点
      </p>
    </PageLayout>
  );
}
