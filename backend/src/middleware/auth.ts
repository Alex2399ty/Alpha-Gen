import { Response, NextFunction } from 'express';
import { AuthedRequest, Tier } from '../types';
import { supabaseAdmin, supabaseForToken } from '../lib/supabase';

/**
 * Verifies the Supabase access token in the Authorization header,
 * loads the user's tier, and attaches an RLS-scoped client.
 */
export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'Missing bearer token' });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  // Load tier from public.users (defaults to free).
  let tier: Tier = 'free';
  const { data: row } = await supabaseAdmin
    .from('users')
    .select('tier')
    .eq('id', data.user.id)
    .maybeSingle();
  if (row?.tier) tier = row.tier as Tier;

  req.user = { id: data.user.id, email: data.user.email || '', tier };
  req.accessToken = token;
  req.db = supabaseForToken(token);
  next();
}
