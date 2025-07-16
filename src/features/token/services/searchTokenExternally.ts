import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { IToken } from "../types/IToken";

const baseIcon = "/icons/tokens";

// CoinGecko platform IDs mapeados a chainId
const platformMap: Record<number, string> = {
  1: "ethereum",
  56: "binance-smart-chain",
  42161: "arbitrum-one",
};

/**
 * Hybrid search that uses CoinGecko for visuals and Moralis for address resolution.
 * Only 1 request to CoinGecko and 1 to Moralis per selected token.
 */
export async function searchTokenExternally(
  query: string,
  chainId: number
): Promise<IToken[]> {
  try {
    const platform = platformMap[chainId];
    if (!platform) return [];

    // Step 1: Search visuals in CoinGecko
    const searchResponse = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
        query
      )}`
    );
    const searchData = await searchResponse.json();

    const coins = (searchData?.coins ?? []) as any[];
    if (!coins.length) return [];

    const topSuggestions = coins.slice(0, 5); // limit to top 5 to reduce load

    const results: IToken[] = [];

    for (const coin of topSuggestions) {
      const symbol = coin.symbol.toUpperCase();

      try {
        const chain = EvmChain.create(chainId);
        const response = await Moralis.EvmApi.token.getTokenMetadataBySymbol({
          symbols: [symbol],
          chain,
        });

        const data = response.toJSON()[0];
        if (!data?.address) continue;

        results.push({
          symbol: data.symbol,
          name: data.name,
          address: data.address,
          decimals: parseInt(data.decimals ?? "18", 10),
          icon: coin.thumb || data.logo || `${baseIcon}/default.png`,
          chainId,
        });
      } catch (e) {
        console.warn(`⚠️ Failed to resolve metadata for ${symbol}`, e);
        continue;
      }
    }

    return results;
  } catch (e) {
    console.error("searchTokenExternally failed:", e);
    return [];
  }
}
