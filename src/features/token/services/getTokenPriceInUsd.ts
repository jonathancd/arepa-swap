import { IToken } from "../types/IToken";

/**
 * Fetch token price using address or symbol.
 * Needs to replace this with Moralis, CoinGecko, etc.
 */
export async function getTokenPriceInUsd(
  token: IToken
): Promise<number | null> {
  try {
    // MOCK: return fixed value by symbol for now
    switch (token.symbol) {
      case "WETH":
      case "WBNB":
        return 3200; // mock ETH/BNB price
      case "USDT":
        return 1;
      default:
        return null;
    }
  } catch (e) {
    console.error("Failed to fetch price for", token.symbol, e);
    return null;
  }
}
