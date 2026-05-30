import { Router, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { AuthedRequest } from '../types';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

/** Returns the current authenticated user's profile. */
router.get('/me', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, email, name, avatar_url, tier, created_at')
    .eq('id', req.user!.id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ user: data ?? { id: req.user!.id, email: req.user!.email, tier: req.user!.tier } });
});

/** Update display name / avatar. */
router.patch('/me', requireAuth, async (req: AuthedRequest, res: Response) => {
  const { name, avatar_url } = req.body ?? {};
  const { data, error } = await req
    .db!.from('users')
    .update({ name, avatar_url })
    .eq('id', req.user!.id)
    .select()
    .maybeSingle();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data });
});

export default router;
