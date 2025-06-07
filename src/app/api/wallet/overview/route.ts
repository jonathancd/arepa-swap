import { NextRequest, NextResponse } from "next/server";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { initMoralis } from "@/lib/initMoralis";
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

    const results = await Promise.allSettled(
      Object.entries(chains).map(([name, chain]) =>
        Moralis.EvmApi.token
          .getWalletTokenBalances({ address, chain })
          .then((res) =>
            res.toJSON().map((token) => ({
              contract_address: token.token_address,
              contract_name: token.name,
              contract_ticker_symbol: token.symbol,
              logo_url: token.logo || "",
              decimals: token.decimals,
              balance:
                Number(token.balance) / Math.pow(10, token.decimals || 18),
              network: name,
            }))
          )
      )
    );

    const allTokens = results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => (result.status === "fulfilled" ? result.value : []));

    const filtered = allTokens.filter((token) => token.balance > 0);

    // Obtener precios en paralelo
    const priceResults = await Promise.allSettled(
      filtered.map((token) =>
        Moralis.EvmApi.token
          .getTokenPrice({
            address: token.contract_address,
            chain: chains[token.network],
          })
          .then((res) => ({
            token_address: token.contract_address,
            usdPrice: res.toJSON().usdPrice || 0,
          }))
          .catch(() => ({
            token_address: token.contract_address,
            usdPrice: 0,
          }))
      )
    );

    const priceMap = Object.fromEntries(
      priceResults
        .filter((r) => r.status === "fulfilled")
        .map((r: any) => [
          r.value.token_address.toLowerCase(),
          r.value.usdPrice,
        ])
    );

    // Funciones de control de calidad
    const isSuspiciousToken = (token: any) =>
      !token.logo_url ||
      token.contract_name.toLowerCase().includes(".org") ||
      token.contract_ticker_symbol.toLowerCase().includes(".org");

    const isSuspiciousQuote = (quote: number) =>
      !Number.isFinite(quote) || quote < 0 || quote > 10_000;

    const enriched = filtered
      .map((token) => {
        const price = priceMap[token.contract_address.toLowerCase()] || 0;
        const quote = token.balance * price;

        return {
          ...token,
          quote: isSuspiciousQuote(quote) ? null : quote,
          is_suspicious:
            isSuspiciousToken(token) || isSuspiciousQuote(quote) || price === 0,
        };
      })
      .filter((token) => typeof token.quote === "number" && token.quote > 0);

    const totalUSD = enriched.reduce((acc, t) => acc + (t.quote ?? 0), 0);

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
