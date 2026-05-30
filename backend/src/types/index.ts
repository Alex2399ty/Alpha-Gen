import { Request } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';

export type Tier = 'free' | 'pro' | 'alpha';

export interface AuthUser {
  id: string;
  email: string;
  tier: Tier;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
  accessToken?: string;
  db?: SupabaseClient; // RLS-scoped client for the requesting user
}
