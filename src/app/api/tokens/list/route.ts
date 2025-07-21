import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map<string, any>();
const CACHE_TTL = 60 * 10 * 1000; // 10 minutos
const cacheTimestamps = new Map<string, number>();

// CoinGecko platform map
const platformMap: Record<number, string> = {
  1: "ethereum",
  56: "binance-smart-chain",
  42161: "arbitrum-one",
  137: "polygon-pos",
  43114: "avalanche",
  10: "optimistic-ethereum",
  8453: "base",
  11155111: "sepolia",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chainId = Number(searchParams.get("chainId"));
  const page = Number(searchParams.get("page") || 1);
  const perPage = 100; // CoinGecko max is 250, pero 100 es seguro

  if (!chainId || !platformMap[chainId]) {
    return NextResponse.json(
      { error: "Invalid or missing chainId" },
      { status: 400 }
    );
  }

  const platform = platformMap[chainId];
  // const cacheKey = `${chainId}:${page}`;
  // const now = Date.now();

  // Check cache and TTL
  // if (cache.has(cacheKey)) {
  //   const ts = cacheTimestamps.get(cacheKey) || 0;
  //   if (now - ts < CACHE_TTL) {
  //     return NextResponse.json(cache.get(cacheKey));
  //   } else {
  //     cache.delete(cacheKey);
  //     cacheTimestamps.delete(cacheKey);
  //   }
  // }

  // CoinGecko coins/markets endpoint (gives symbol, name, image, address)
  // Docs: https://www.coingecko.com/api/documentation
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&locale=en&x_cg_pro_api_key=&platform=${platform}`;
  let tokens = [];
  let res = await fetch(url);

  if (res.ok) {
    tokens = await res.json();
  } else {
    return NextResponse.json([]);
  }

  // Map to minimal token info
  const mapped = tokens.map((t: any) => ({
    symbol: t.symbol,
    name: t.name,
    icon: t.image || t.thumb || "",
    address: t.contract_address || "",
    id: t.id,
  }));

  // Save to cache
  // cache.set(cacheKey, mapped);
  // cacheTimestamps.set(cacheKey, now);

  return NextResponse.json(mapped);
}
