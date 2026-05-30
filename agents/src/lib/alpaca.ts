import { env } from './env';

export interface Quote { symbol: string; price: number; }

/** Fetch latest trade prices for a batch of symbols from Alpaca. */
export async function getLatestPrices(symbols: string[]): Promise<Quote[]> {
  if (!symbols.length) return [];
  if (!env.alpacaKey) {
    console.warn('[alpaca] no API key set — returning empty price set');
    return [];
  }
  const url = `${env.alpacaDataUrl}/v2/stocks/trades/latest?symbols=${encodeURIComponent(symbols.join(','))}`;
  const resp = await fetch(url, {
    headers: {
      'APCA-API-KEY-ID': env.alpacaKey,
      'APCA-API-SECRET-KEY': env.alpacaSecret,
    },
  });
  if (!resp.ok) throw new Error(`Alpaca ${resp.status}`);
  const json = (await resp.json()) as { trades?: Record<string, { p: number }> };
  return Object.entries(json.trades ?? {}).map(([symbol, t]) => ({ symbol, price: t.p }));
}
