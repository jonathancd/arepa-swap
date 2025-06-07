import { NextRequest, NextResponse } from "next/server";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { initMoralis } from "@/lib/initMoralis";
import {
  enrichWithQuote,
  isSuspiciousToken,
  normalizeToken,
} from "@/features/token/adapters/tokenAdapter";
import { fetchTokenPrice } from "@/features/token/utils/fetchTokenPrice";
import Moralis from "moralis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    await initMoralis();

    const chains: Record<string, EvmChain> = {
      ethereum: EvmChain.ETHEREUM,
      bsc: EvmChain.BSC,
      polygon: EvmChain.POLYGON,
    };

    // 1. Obtener balances de cada red
    const results = await Promise.allSettled(
      Object.entries(chains).map(([network, chain]) =>
        Moralis.EvmApi.token
          .getWalletTokenBalances({ address, chain })
          .then((res) =>
            res.toJSON().map((rawToken) => normalizeToken(rawToken, network))
          )
      )
    );

    const allTokens = results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => (result.status === "fulfilled" ? result.value : []));

    const filtered = allTokens.filter(
      (token) => token.balance > 0 && !isSuspiciousToken(token)
    );

    // 2. Obtener precios
    const priceResults = await Promise.allSettled(
      filtered.map((token) =>
        fetchTokenPrice(token.contract_address, chains[token.network])
      )
    );

    const priceMap = Object.fromEntries(
      filtered.map((token, index) => [
        token.contract_address.toLowerCase(),
        priceResults[index].status === "fulfilled"
          ? priceResults[index].value
          : 0,
      ])
    );

    const enriched = filtered
      .map((token) =>
        enrichWithQuote(token, priceMap[token.contract_address.toLowerCase()])
      )
      .filter((t) => t.quote !== null && t.quote > 0);

    // 4. Calcular total en USD
    const totalUSD = enriched.reduce(
      (sum, token) => sum + (token.quote ?? 0),
      0
    );

    return NextResponse.json({
      tokens: enriched,
      totalUSD,
    });
  } catch (error) {
    console.error("❌ Error in full-balances API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
