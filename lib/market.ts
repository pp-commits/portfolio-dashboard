
import NodeCache from "node-cache";
import Bottleneck from "bottleneck";
import YahooFinance from "yahoo-finance2";

// -------------------------------
// Types
// -------------------------------
type PriceInfo = {
  cmp: number | null;
  pe: number | null;
  eps: number | null;               // numeric EPS
  latestEarnings: string | null;    // EPS as string for UI
  error?: boolean;
};

// -------------------------------
// Instances
// -------------------------------
const yahooFinance = new YahooFinance();

const cache = new NodeCache({
  stdTTL: 20,        // 20 seconds cache
  checkperiod: 60,   // cleanup
});

const limiter = new Bottleneck({
  maxConcurrent: 2,   // Max 2 yahoo hits at once
  minTime: 200,       // 200ms between requests
});

// -------------------------------
// Helpers
// -------------------------------
function cleanNumber(val: any): number | null {
  if (typeof val === "number" && isFinite(val) && val > 0) {
    return val;
  }
  return null;
}

function cleanEPS(val: any): { eps: number | null; latest: string | null } {
  if (typeof val === "number" && isFinite(val)) {
    return { eps: val, latest: val.toString() };
  }
  return { eps: null, latest: null };
}

// -------------------------------
// Single symbol fetcher
// -------------------------------
async function fetchSingle(symbol: string): Promise<PriceInfo> {
  const key = `price:${symbol}`;
  const cached = cache.get<PriceInfo>(key);
  if (cached) return cached;

  const result = await limiter.schedule(async () => {
    try {
      // Fetch Yahoo summary
      const q: any = await yahooFinance.quoteSummary(symbol, {
        modules: ["price", "summaryDetail", "defaultKeyStatistics"],
      });

      // CMP
      const rawCmp =
        q?.price?.regularMarketPrice ??
        q?.summaryDetail?.regularMarketPrice ??
        null;

      const cmp = cleanNumber(rawCmp);

      // P/E
      const rawPE =
        q?.defaultKeyStatistics?.trailingPE ??
        q?.summaryDetail?.trailingPE ??
        null;

      const pe = cleanNumber(rawPE);

      // EPS
      const rawEPS =
        q?.defaultKeyStatistics?.trailingEps ??
        q?.defaultKeyStatistics?.forwardEps ??
        null;

      const { eps, latest } = cleanEPS(rawEPS);

      const out: PriceInfo = {
        cmp,
        pe,
        eps,
        latestEarnings: latest,
      };

      cache.set(key, out);
      return out;
    } catch (err: any) {
      console.error("market fetch error", symbol, err?.message ?? err);

      const out: PriceInfo = {
        cmp: null,
        pe: null,
        eps: null,
        latestEarnings: null,
        error: true,
      };

      cache.set(key, out);
      return out;
    }
  });

  return result;
}

// -------------------------------
// Batch fetcher
// -------------------------------
export async function fetchPricesForSymbols(
  symbols: string[]
): Promise<Record<string, PriceInfo>> {
  const unique = Array.from(new Set(symbols));

  const map: Record<string, PriceInfo> = {};

  await Promise.all(
    unique.map(async (symbol) => {
      map[symbol] = await fetchSingle(symbol);
    })
  );

  return map;
}
