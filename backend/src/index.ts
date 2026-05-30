import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { WebSocketServer, WebSocket } from 'ws';
import { env } from './config/env';
import { notFound, errorHandler } from './middleware/error';

import authRoutes from './routes/auth';
import waitlistRoutes from './routes/waitlist';
import stocksRoutes from './routes/stocks';
import portfolioRoutes from './routes/portfolios';
import holdingsRoutes from './routes/holdings';
import watchlistRoutes from './routes/watchlist';
import newsRoutes from './routes/news';

// ── WebSocket client registry + broadcast helper ──
const clients = new Set<WebSocket>();

/** Broadcast a message to all connected WebSocket clients. */
export function broadcast(payload: unknown): void {
  const msg = JSON.stringify(payload);
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) ws.send(msg);
  }
}

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',') }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'alphagen-backend', ts: Date.now() }));

app.use('/api/auth', authRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/holdings', holdingsRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/news', newsRoutes);

// Internal endpoint that agent workers call to push updates to clients.
// Protected by a shared secret header in production.
app.post('/internal/broadcast', (req, res) => {
  const secret = process.env.INTERNAL_SECRET;
  if (secret && req.headers['x-internal-secret'] !== secret) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  broadcast(req.body);
  res.json({ delivered: clients.size });
});

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'hello', ts: Date.now() }));
  ws.on('close', () => clients.delete(ws));
  ws.on('error', () => clients.delete(ws));
});

server.listen(env.port, () => {
  console.log(`[alphagen] backend listening on :${env.port} (${env.nodeEnv})`);
});
