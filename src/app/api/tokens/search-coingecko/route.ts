import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map<string, any>();
const CACHE_TTL = 60 * 5 * 1000; // 5 minutos
const cacheTimestamps = new Map<string, number>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const chainId = searchParams.get("chainId");

  if (!query || !chainId) {
    return NextResponse.json(
      { error: "Missing query or chainId" },
      { status: 400 }
    );
  }

  const cacheKey = `${chainId}:${query.toLowerCase()}`;
  const now = Date.now();

  // Check cache and TTL
  if (cache.has(cacheKey)) {
    const ts = cacheTimestamps.get(cacheKey) || 0;
    if (now - ts < CACHE_TTL) {
      return NextResponse.json(cache.get(cacheKey));
    } else {
      cache.delete(cacheKey);
      cacheTimestamps.delete(cacheKey);
    }
  }

  // Call CoinGecko
  const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: "CoinGecko error" }, { status: 500 });
  }
  const data = await res.json();

  // Optionally, you could filter results by chain/platform here if needed

  // Save to cache
  cache.set(cacheKey, data);
  cacheTimestamps.set(cacheKey, now);

  return NextResponse.json(data);
}
