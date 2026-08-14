import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { PageLayout } from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { BattleCard } from '../../components/battle/BattleCard';
import { socket } from '../../socket/socket';
import { handAtom, selectedCardAtom, playedCardIdsAtom } from '../../store/game';

export function BattlePage() {
  const hand = useAtomValue(handAtom);
  const playedCardIds = useAtomValue(playedCardIdsAtom);
  const [selectedCard, setSelectedCard] = useAtom(selectedCardAtom);
  const setPlayedCardIds = useSetAtom(playedCardIdsAtom);

  function handlePlay() {
    if (selectedCard === null) return;
    socket.emit('battle:playCard', { cardId: selectedCard });
    setPlayedCardIds([...playedCardIds, selectedCard]);
    setSelectedCard(null);
    // 画面遷移(/waiting)はサーバーからの 'battle:waitOpponentPlay' 受信で行う(useGameSync参照)
  }

  return (
    <PageLayout title="相手に見せるカードを選んでください">
      <div className="battle-page__cards">
        {hand.map((card) => (
          <BattleCard
            key={card.id}
            card={card}
            selected={selectedCard === card.id}
            disabled={playedCardIds.includes(card.id)}
            onSelect={setSelectedCard}
          />
        ))}
      </div>

      <Button onClick={handlePlay} disabled={selectedCard === null}>
        このカードを出す
      </Button>
    </PageLayout>
  );
}
