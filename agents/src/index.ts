import { Queue, Worker, QueueEvents, ConnectionOptions } from 'bullmq';
import { env } from './lib/env';
import { runPriceAgent } from './jobs/priceAgent';
import { runSignalAgent } from './jobs/signalAgent';

const connection: ConnectionOptions = { url: env.redisUrl };

const QUEUE = 'alphagen-agents';
const queue = new Queue(QUEUE, { connection });

// Job handlers keyed by job name.
const handlers: Record<string, () => Promise<void>> = {
  'price-agent': runPriceAgent,
  'signal-agent': runSignalAgent,
};

const worker = new Worker(
  QUEUE,
  async (job) => {
    const fn = handlers[job.name];
    if (!fn) throw new Error(`No handler for job ${job.name}`);
    await fn();
  },
  { connection }
);

worker.on('failed', (job, err) => console.error(`[worker] ${job?.name} failed:`, err.message));
worker.on('completed', (job) => console.log(`[worker] ${job.name} completed`));

const events = new QueueEvents(QUEUE, { connection });
events.on('error', (e) => console.error('[queue] error:', e.message));

/**
 * Register repeatable jobs (BullMQ cron). Market-hours filtering is enforced
 * inside the price agent in production; here we schedule the cadence.
 */
async function scheduleJobs(): Promise<void> {
  await queue.add('price-agent', {}, { repeat: { every: 60_000 }, removeOnComplete: true, removeOnFail: 50 });
  // Signal agent: full daily run at 06:00 (UTC cron; adjust to ET in prod).
  await queue.add('signal-agent', {}, { repeat: { pattern: '0 6 * * *' }, removeOnComplete: true, removeOnFail: 50 });
  console.log('[agents] repeatable jobs scheduled');
}

scheduleJobs().catch((e) => {
  console.error('[agents] failed to schedule jobs:', e.message);
});

console.log(`[alphagen] agents worker started (redis: ${env.redisUrl})`);
