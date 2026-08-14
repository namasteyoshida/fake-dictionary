import { useAtomValue } from 'jotai';
import { PageLayout } from '../../components/common/PageLayout';
import { roomIdAtom } from '../../store/game';

export function MatchingPage() {
  const roomId = useAtomValue(roomIdAtom);

  return (
    <PageLayout title="対戦相手を待っています…">
      {roomId && (
        <p>
          この部屋IDを相手に共有してください:
          <br />
          <span className="room-id-code">{roomId}</span>
        </p>
      )}
      <p className="matching-page__spinner" aria-label="loading" />
    </PageLayout>
  );
}
