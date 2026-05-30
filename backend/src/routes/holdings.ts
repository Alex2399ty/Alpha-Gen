import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { AuthedRequest } from '../types';

const router = Router();
router.use(requireAuth);

const schema = z.object({
  portfolio_id: z.string().uuid(),
  symbol: z.string().min(1).max(10),
  shares: z.number().min(0),
  avg_cost: z.number().min(0),
});

/** List holdings for a portfolio the user owns (RLS enforces ownership). */
router.get('/:portfolioId', async (req: AuthedRequest, res: Response) => {
  const { data, error } = await req
    .db!.from('holdings')
    .select('*')
    .eq('portfolio_id', req.params.portfolioId)
    .order('added_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ holdings: data ?? [] });
});

/** Add a holding. */
router.post('/', async (req: AuthedRequest, res: Response) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', details: parsed.error.flatten() });
  const { data, error } = await req
    .db!.from('holdings')
    .insert({ ...parsed.data, symbol: parsed.data.symbol.toUpperCase() })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ holding: data });
});

/** Remove a holding. */
router.delete('/:id', async (req: AuthedRequest, res: Response) => {
  const { error } = await req.db!.from('holdings').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

export default router;
