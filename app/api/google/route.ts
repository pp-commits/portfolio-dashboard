
import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

const CACHE_TTL = 15000;
const cache: Record<string, { data: any; ts: number }> = {};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");

    if (!symbol)
      return NextResponse.json({ error: "symbol required" }, { status: 400 });

    // serve from cache
    const now = Date.now();
    if (cache[symbol] && now - cache[symbol].ts < CACHE_TTL) {
      return NextResponse.json(cache[symbol].data);
    }

    // USE MOBILE GOOGLE FINANCE (WORKS)
    const url = `https://www.google.com/finance/quote/${encodeURIComponent(
      symbol
    )}?hl=en&gl=US&ceid=US:en`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) " +
          "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // mobile google uses `.P6K39c` for labels and `.YMlKec` for values
    const peLabel = $("div.P6K39c:contains('P/E ratio')").first();
    const epsLabel = $("div.P6K39c:contains('EPS')").first();

    const pe =
      peLabel.length > 0
        ? peLabel.parent().find(".YMlKec").first().text().trim()
        : "";

    const latestEarnings =
      epsLabel.length > 0
        ? epsLabel.parent().find(".YMlKec").first().text().trim()
        : "";

    const cleaned = {
      symbol,
      pe: /^\d+(\.\d+)?$/.test(pe) ? pe : "",
      latestEarnings: /^\d+(\.\d+)?$/.test(latestEarnings)
        ? latestEarnings
        : "",
    };

    // store in cache
    cache[symbol] = { data: cleaned, ts: Date.now() };

    return NextResponse.json(cleaned);
  } catch (err: any) {
    console.error("Google Finance Error:", err.message);
    return NextResponse.json(
      { symbol: "", pe: "", latestEarnings: "" },
      { status: 200 }
    );
  }
}
