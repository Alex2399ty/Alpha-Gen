import { Request, Response, NextFunction } from 'express';

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'not_found' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const message = err instanceof Error ? err.message : 'Internal server error';
  console.error('[error]', err);
  res.status(500).json({ error: 'internal_error', message });
}
