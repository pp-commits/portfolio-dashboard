import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchPricesForSymbols } from "@/lib/market";
import axios from "axios";
export const runtime = "nodejs";
/**
 * Fetch Google Finance fallback P/E + EPS
 */
async function fetchGoogleData(symbol: string, baseUrl: string) {
  try {
    const googleSymbol = `${symbol.replace(".NS", "")}:NSE`;

    const res = await axios.get(
      `${baseUrl}/api/google?symbol=${encodeURIComponent(googleSymbol)}`,
      { timeout: 8000 }
    );

    return {
      pe: res.data?.pe || "",
      latestEarnings: res.data?.latestEarnings || "",
    };
  } catch (err) {
    console.error("Google fallback error:", err);
    return { pe: "", latestEarnings: "" };
  }
}

export async function GET(req: Request) {
  try {
    const baseUrl = new URL(req.url).origin;

    // 1) Fetch DB holdings
    const holdings = await prisma.holding.findMany({
      orderBy: { id: "asc" },
    });

    if (holdings.length === 0) {
      return NextResponse.json({
        portfolio: [],
        sectors: {},
        totals: {
          totalInvestment: 0,
          totalPresent: 0,
          lastUpdated: Date.now(),
        },
      });
    }

    // 2) Yahoo Fetch (CMP + PE + EPS)
    const symbols = holdings.map((h) => h.symbol);
    const priceMap = await fetchPricesForSymbols(symbols);

    // 3) Google Fallback Fetch (PE + EPS)
    const googleResults = await Promise.all(
      holdings.map((h) => fetchGoogleData(h.symbol, baseUrl))
    );

    // 4) Merge into portfolio objects
    const portfolio = holdings.map((h, idx) => {
      const yahoo = priceMap[h.symbol] ?? {
        cmp: null,
        pe: null,
        eps: null,
      };

      const google = googleResults[idx] ?? {
        pe: "",
        latestEarnings: "",
      };

      const cmp = yahoo.cmp ?? 0;

      // ---- MERGE LOGIC -----

      // P/E: Yahoo → Google → ""
      const pe =
        yahoo.pe !== null && yahoo.pe !== undefined && yahoo.pe !== 0
          ? yahoo.pe.toString()
          : google.pe || "";

      // EPS (Latest Earnings): Yahoo → Google → ""
      const latestEarnings =
        yahoo.eps !== null && yahoo.eps !== undefined && yahoo.eps !== 0
          ? yahoo.eps.toString()
          : google.latestEarnings || "";

      // ---- FINANCIALS -----

      const investment = Number(h.purchasePrice) * h.quantity;
      const presentValue = cmp * h.quantity;
      const gainLoss = presentValue - investment;

      return {
        id: h.id,
        symbol: h.symbol,
        name: h.name,
        exchange: h.exchange,
        purchasePrice: Number(h.purchasePrice),
        quantity: h.quantity,
        sector: h.sector,
        notes: h.notes,
        cmp,
        pe,
        latestEarnings,
        investment,
        presentValue,
        gainLoss,
      };
    });

    // 5) Portfolio percentage calculations
    const totalInvestment = portfolio.reduce((s, p) => s + p.investment, 0);

    const withPct = portfolio.map((p) => ({
      ...p,
      portfolioPct:
        totalInvestment > 0 ? (p.investment / totalInvestment) * 100 : 0,
    }));

    // 6) Sector grouping
    const sectors: Record<string, any> = {};

    withPct.forEach((p) => {
      if (!sectors[p.sector]) {
        sectors[p.sector] = {
          items: [],
          totalInvestment: 0,
          totalPresent: 0,
          totalGainLoss: 0,
        };
      }
      sectors[p.sector].items.push(p);
      sectors[p.sector].totalInvestment += p.investment;
      sectors[p.sector].totalPresent += p.presentValue;
      sectors[p.sector].totalGainLoss += p.gainLoss;
    });

    // 7) Totals summary
    const totals = {
      totalInvestment,
      totalPresent: portfolio.reduce((s, p) => s + p.presentValue, 0),
      lastUpdated: Date.now(),
    };

    return NextResponse.json({ portfolio: withPct, sectors, totals });
  } catch (err) {
    console.error("Portfolio API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
