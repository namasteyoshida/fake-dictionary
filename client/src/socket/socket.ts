import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../types/game';

const getAutoServerUrl = () => {
  if (import.meta.env.VITE_SERVER_URL) return import.meta.env.VITE_SERVER_URL;
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'https:') {
      return 'http://localhost:3001';
    }
    return `http://${window.location.hostname}:3001`;
  }
  return 'http://localhost:3001';
};


const SERVER_URL = getAutoServerUrl();

// アプリ全体で1つの接続を共有する(ページ遷移のたびに繋ぎ直さない)
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SERVER_URL, {
  autoConnect: false, // TitlePageで明示的にconnect()する
});

