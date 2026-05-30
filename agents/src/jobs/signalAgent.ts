import { db } from '../lib/supabase';
import { ask } from '../lib/claude';
import { broadcast } from '../lib/broadcast';

const SYSTEM = `You are AlphaGen's Signal Intelligence AI. Analyze the data for a stock and choose exactly one signal: STRONG_HOLD, HOLD, WATCH, or CONSIDER_SWAP. Provide a specific, data-driven reason in 1-2 sentences and a confidence score 0-100. If CONSIDER_SWAP, name the best alternative. Be direct and never vague. Respond ONLY as compact JSON: {"signal":"...","confidence":NN,"reason":"...","swap_symbol":null,"swap_reason":null}.`;

type SignalOut = {
  signal: string;
  confidence: number;
  reason: string;
  swap_symbol: string | null;
  swap_reason: string | null;
};

const VALID = new Set(['STRONG_HOLD', 'HOLD', 'WATCH', 'CONSIDER_SWAP']);

/**
 * AGENT 2 — Signal Intelligence Agent.
 * Re-evaluates each stock's signal from price action, news, insider and macro data.
 */
export async function runSignalAgent(): Promise<void> {
  const { data: stocks, error } = await db
    .from('stocks')
    .select('symbol, name, sector, current_price, ceo_score, pe_ratio, beta, div_yield');
  if (error) {
    console.error('[signalAgent] load failed:', error.message);
    return;
  }

  for (const s of stocks ?? []) {
    const { data: news } = await db
      .from('news_items')
      .select('headline, sentiment, published_at')
      .eq('symbol', s.symbol)
      .order('published_at', { ascending: false })
      .limit(5);
    const { data: insiders } = await db
      .from('insider_trades')
      .select('filer_title, transaction_type, total_value, is_10b5_1_plan')
      .eq('symbol', s.symbol)
      .order('filed_at', { ascending: false })
      .limit(5);

    const payload = JSON.stringify({ stock: s, recent_news: news ?? [], insider_activity: insiders ?? [] });

    let parsed: SignalOut | null = null;
    try {
      const raw = await ask(SYSTEM, payload, 400);
      parsed = JSON.parse(raw) as SignalOut;
    } catch (e) {
      console.warn(`[signalAgent] ${s.symbol} parse/skip:`, (e as Error).message);
      continue;
    }

    const signal = String(parsed.signal || '').toUpperCase();
    if (!VALID.has(signal)) continue;

    await db
      .from('stocks')
      .update({
        daily_signal: signal.toLowerCase(),
        signal_confidence: Math.max(0, Math.min(100, Math.round(parsed.confidence))),
        signal_reason: parsed.reason,
        signal_updated_at: new Date().toISOString(),
        swap_suggestion_symbol: parsed.swap_symbol,
        swap_suggestion_reason: parsed.swap_reason,
      })
      .eq('symbol', s.symbol);

    await broadcast({ type: 'signal', symbol: s.symbol, signal, confidence: parsed.confidence });
  }
  console.log(`[signalAgent] evaluated ${(stocks ?? []).length} stocks`);
}
