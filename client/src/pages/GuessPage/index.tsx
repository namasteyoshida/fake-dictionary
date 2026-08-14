import { useAtomValue } from 'jotai';
import { PageLayout } from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { GuessCard } from '../../components/guess/GuessCard';
import { Timer } from '../../components/common/Timer';
import { socket } from '../../socket/socket';
import { opponentCardAtom } from '../../store/game';
import type { Guess } from '../../types/game';

export function GuessPage() {
  const opponentCard = useAtomValue(opponentCardAtom);

  function handleGuess(guess: Guess) {
    socket.emit('guess:submit', { guess });
  }

  function handleTimeUp() {
    handleGuess('real');
  }

  if (!opponentCard) {
    return (
      <PageLayout title="回答">
        <p>カード情報を読み込んでいます…</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="このカードはリアル？偽物？">
      <Timer seconds={30} onTimeUp={handleTimeUp} />
      <GuessCard card={opponentCard} />

      <div className="guess-page__buttons">
        <Button onClick={() => handleGuess('real')}>リアル</Button>
        <Button variant="secondary" onClick={() => handleGuess('fake')}>
          偽物
        </Button>
      </div>
    </PageLayout>
  );
}

