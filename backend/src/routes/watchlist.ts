import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { AuthedRequest } from '../types';

const router = Router();
router.use(requireAuth);

const schema = z.object({
  symbol: z.string().min(1).max(10),
  alert_threshold: z.number().optional(),
});

router.get('/', async (req: AuthedRequest, res: Response) => {
  const { data, error } = await req.db!.from('watchlist').select('*').order('added_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ watchlist: data ?? [] });
});

router.post('/', async (req: AuthedRequest, res: Response) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', details: parsed.error.flatten() });
  const { data, error } = await req
    .db!.from('watchlist')
    .upsert(
      { ...parsed.data, symbol: parsed.data.symbol.toUpperCase(), user_id: req.user!.id },
      { onConflict: 'user_id,symbol' }
    )
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ item: data });
});

router.delete('/:symbol', async (req: AuthedRequest, res: Response) => {
  const { error } = await req
    .db!.from('watchlist')
    .delete()
    .eq('user_id', req.user!.id)
    .eq('symbol', req.params.symbol.toUpperCase());
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

export default router;
