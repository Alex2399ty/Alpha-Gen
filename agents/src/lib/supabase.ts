import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

export const db: SupabaseClient = createClient(
  env.supabaseUrl || 'http://localhost',
  env.supabaseServiceRoleKey || 'service-role-placeholder',
  { auth: { autoRefreshToken: false, persistSession: false } }
);
