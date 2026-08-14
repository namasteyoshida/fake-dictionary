import { PageLayout } from '../../components/common/PageLayout';

export function WaitingPage() {
  return (
    <PageLayout title="相手の回答を待っています…">
      <p className="waiting-page__spinner" aria-label="loading" />
    </PageLayout>
  );
}
