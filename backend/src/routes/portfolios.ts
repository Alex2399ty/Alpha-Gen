import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { AuthedRequest } from '../types';

const router = Router();
router.use(requireAuth);

const upsertSchema = z.object({
  name: z.string().max(120).optional(),
  risk_level: z.number().int().min(1).max(10).optional(),
  time_horizon_years: z.number().int().min(0).max(80).optional(),
  investment_amount: z.number().min(0).optional(),
  monthly_dca: z.number().min(0).optional(),
  dividend_strategy: z.string().max(40).optional(),
  sectors: z.array(z.string()).optional(),
});

/** List the user's portfolios (RLS-scoped). */
router.get('/', async (req: AuthedRequest, res: Response) => {
  const { data, error } = await req.db!.from('portfolios').select('*').order('created_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ portfolios: data ?? [] });
});

/** Create a portfolio. */
router.post('/', async (req: AuthedRequest, res: Response) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', details: parsed.error.flatten() });
  const { data, error } = await req
    .db!.from('portfolios')
    .insert({ ...parsed.data, user_id: req.user!.id })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ portfolio: data });
});

/** Update a portfolio. */
router.patch('/:id', async (req: AuthedRequest, res: Response) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', details: parsed.error.flatten() });
  const { data, error } = await req
    .db!.from('portfolios')
    .update(parsed.data)
    .eq('id', req.params.id)
    .select()
    .maybeSingle();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'not_found' });
  res.json({ portfolio: data });
});

/** Delete a portfolio. */
router.delete('/:id', async (req: AuthedRequest, res: Response) => {
  const { error } = await req.db!.from('portfolios').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

export default router;
