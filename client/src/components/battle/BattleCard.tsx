import type { HandCard } from '../../types/game';
import { sound } from '../../utils/sound';

type Props = {
  card: HandCard;
  selected: boolean;
  disabled: boolean; // 使用済みなど選択不可の場合
  onSelect: (cardId: number) => void;
};

export function BattleCard({ card, selected, disabled, onSelect }: Props) {
  function handleClick() {
    sound.playSelectCard();
    onSelect(card.id);
  }

  return (
    <button
      type="button"
      className={`battle-card ${selected ? 'battle-card--selected' : ''} ${disabled ? 'battle-card--disabled' : ''}`}
      disabled={disabled}
      onClick={handleClick}
    >
      <p className="battle-card__word">{card.word}</p>
      <p className="battle-card__meaning">{card.meaning}</p>
    </button>
  );
}

