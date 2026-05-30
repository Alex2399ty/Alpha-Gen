import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

/** List the stock universe (public). Supports ?sector= and ?signal= filters. */
router.get('/', async (req: Request, res: Response) => {
  let q = supabaseAdmin.from('stocks').select('*').order('symbol');
  if (req.query.sector) q = q.eq('sector', String(req.query.sector));
  if (req.query.signal) q = q.eq('daily_signal', String(req.query.signal));
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ stocks: data ?? [] });
});

/** Single stock detail (public). */
router.get('/:symbol', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('stocks')
    .select('*')
    .eq('symbol', req.params.symbol.toUpperCase())
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'not_found' });
  res.json({ stock: data });
});

export default router;
