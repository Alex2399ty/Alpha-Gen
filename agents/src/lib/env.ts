import dotenv from 'dotenv';
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
  alpacaKey: process.env.ALPACA_API_KEY || '',
  alpacaSecret: process.env.ALPACA_API_SECRET || '',
  alpacaDataUrl: process.env.ALPACA_DATA_URL || 'https://data.alpaca.markets',
  backendInternalUrl: process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000',
  internalSecret: process.env.INTERNAL_SECRET || '',
};
