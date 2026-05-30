import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

/** Recent news (public). Optional ?symbol= filter and ?limit=. */
router.get('/', async (req: Request, res: Response) => {
  const limit = Math.min(parseInt(String(req.query.limit ?? '50'), 10) || 50, 200);
  let q = supabaseAdmin
    .from('news_items')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (req.query.symbol) q = q.eq('symbol', String(req.query.symbol).toUpperCase());
  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ news: data ?? [] });
});

export default router;
