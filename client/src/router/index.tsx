import { createBrowserRouter, Outlet } from 'react-router-dom';
import { TitlePage } from '../pages/TitlePage';
import { MatchingPage } from '../pages/MatchingPage';
import { MeaningInputPage } from '../pages/MeaningInputPage';
import { BattlePage } from '../pages/BattlePage';
import { WaitingPage } from '../pages/WaitingPage';
import { GuessPage } from '../pages/GuessPage';
import { TurnResultPage } from '../pages/TurnResultPage';
import { ResultPage } from '../pages/ResultPage';
import { useGameSync } from '../socket/useGameSync';

import { NotificationModal } from '../components/NotificationModal';

// useGameSyncはuseNavigateを使うためRouter配下(=このコンポーネント内)で呼ぶ必要がある
function RootLayout() {
  useGameSync();
  return (
    <>
      <Outlet />
      <NotificationModal />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <TitlePage /> },
      { path: '/matching', element: <MatchingPage /> },
      { path: '/meaning-input', element: <MeaningInputPage /> },
      { path: '/battle', element: <BattlePage /> },
      { path: '/waiting', element: <WaitingPage /> },
      { path: '/guess', element: <GuessPage /> },
      { path: '/turn-result', element: <TurnResultPage /> },
      { path: '/result', element: <ResultPage /> },
    ],
  },
]);
