import type { RevealedCard } from '../../types/game';

type Props = {
  card: RevealedCard;
};

export function GuessCard({ card }: Props) {
  return (
    <div className="guess-card">
      <p className="guess-card__word">{card.word}</p>
      <p className="guess-card__meaning">{card.meaning}</p>
    </div>
  );
}
