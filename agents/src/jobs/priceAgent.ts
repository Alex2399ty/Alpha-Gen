import { db } from '../lib/supabase';
import { getLatestPrices } from '../lib/alpaca';
import { broadcast } from '../lib/broadcast';

/**
 * AGENT 1 — Price Update Agent.
 * Fetches latest prices for the full stock universe, writes them to the
 * stocks table, and pushes live ticks to connected clients.
 */
export async function runPriceAgent(): Promise<void> {
  const { data: rows, error } = await db.from('stocks').select('symbol');
  if (error) {
    console.error('[priceAgent] cannot load universe:', error.message);
    return;
  }
  const symbols = (rows ?? []).map((r) => r.symbol as string);
  if (!symbols.length) return;

  const quotes = await getLatestPrices(symbols);
  const now = new Date().toISOString();
  for (const q of quotes) {
    await db
      .from('stocks')
      .update({ current_price: q.price, price_updated_at: now })
      .eq('symbol', q.symbol);
  }
  if (quotes.length) {
    await broadcast({ type: 'prices', ts: Date.now(), quotes });
  }
  console.log(`[priceAgent] updated ${quotes.length}/${symbols.length} symbols`);
}
