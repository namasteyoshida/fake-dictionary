import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { socket } from '../../socket/socket';
import { roomIdAtom, playerNumberAtom } from '../../store/game';

export function TitlePage() {
  const navigate = useNavigate();
  const setRoomId = useSetAtom(roomIdAtom);
  const setPlayerNumber = useSetAtom(playerNumberAtom);
  const [joinInput, setJoinInput] = useState('');

  function ensureConnected() {
    if (!socket.connected) socket.connect();
  }

  function handleAutoMatch() {
    ensureConnected();
    socket.emit('matching:auto', {});
    navigate('/matching'); // 相手が見つかるまでは 'room:waitingForOpponent' 待ち。既に揃っていれば 'game:start' が飛んでくる
  }

  function handleCreateRoom() {
    ensureConnected();
    socket.emit('room:create', {}, (res) => {
      setRoomId(res.roomId);
      setPlayerNumber(res.playerNumber);
      navigate('/matching');
    });
  }

  function handleJoinRoom() {
    if (!joinInput.trim()) return;
    ensureConnected();
    socket.emit('room:join', { roomId: joinInput.trim() }, (res) => {
      if (res.ok) {
        setRoomId(joinInput.trim());
        setPlayerNumber(res.playerNumber);
        navigate('/matching');
      } else {
        // TODO: エラー表示(部屋が見つからない/満室)をトースト等で出す
        console.error(res.reason);
      }
    });
  }

  return (
    <PageLayout title="Fake Dictionary">
      <p>本物とニセモノの単語で相手を騙し合う対戦ゲーム</p>

      <Button onClick={handleAutoMatch}>自動マッチングで対戦</Button>

      <div className="title-page__room-section">
        <Button variant="secondary" onClick={handleCreateRoom}>
          部屋を作って友達を招待
        </Button>

        <div className="title-page__join">
          <input
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value)}
            placeholder="部屋IDを入力"
          />
          <Button variant="secondary" onClick={handleJoinRoom}>
            入室する
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
