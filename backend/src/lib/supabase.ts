import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

/**
 * Admin client — uses the service role key. Bypasses RLS.
 * Use ONLY in trusted server code, never expose to clients.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  env.supabaseUrl || 'http://localhost',
  env.supabaseServiceRoleKey || 'service-role-placeholder',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/**
 * Returns a client scoped to a user's access token so RLS policies apply.
 */
export function supabaseForToken(accessToken: string): SupabaseClient {
  return createClient(
    env.supabaseUrl || 'http://localhost',
    env.supabaseAnonKey || 'anon-placeholder',
    {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
