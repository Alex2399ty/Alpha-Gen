import { env } from './env';

/** Push a payload to all connected frontend clients via the backend WS hub. */
export async function broadcast(payload: unknown): Promise<void> {
  try {
    await fetch(`${env.backendInternalUrl}/internal/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.internalSecret ? { 'x-internal-secret': env.internalSecret } : {}),
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn('[broadcast] failed:', (e as Error).message);
  }
}
