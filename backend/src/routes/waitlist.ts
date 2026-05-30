import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
  source: z.string().max(120).optional(),
});

/** Public endpoint — join the beta waitlist. */
router.post('/', async (req: Request, res: Response) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_input', details: parsed.error.flatten() });
  }
  const { error } = await supabaseAdmin.from('waitlist').insert(parsed.data);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ok: true });
});

export default router;
