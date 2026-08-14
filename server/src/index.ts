import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from './types/game';
import { registerHandlers } from './socket/handlers';

const app = express();
app.get('/', (_req, res) => {
  res.send('Fake Dictionary Socket.io Server is running!');
});
const httpServer = createServer(app);


const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // ローカル開発・同一Wi-Fi・Vercel本番ドメインからのアクセスを許可
      const isLocalDev = !origin || /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);
      const isVercel = !!origin && /\.vercel\.app$/.test(origin);
      const isConfiguredOrigin = !!process.env.CLIENT_ORIGIN && (origin === process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGIN === '*');
      callback(null, isLocalDev || isVercel || isConfiguredOrigin);
    },
  },
});



io.on('connection', (socket) => {
  registerHandlers(io, socket);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
httpServer.listen(PORT, () => {
  console.log(`Fake Dictionary server listening on port ${PORT}`);
});
