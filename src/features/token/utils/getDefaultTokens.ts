import { TokenRegistry } from "../registry/tokenRegistry";
import { DefaultSwapTokens } from "../types/IDefaultSwapTokens";

/**
 * Returns default tokenIn and tokenOut for a given network.
 * Tries to use a base token + USDT if available.
 */
export function getDefaultTokensForNetwork(
  networkId: number
): DefaultSwapTokens | null {
  const tokens = TokenRegistry[networkId];
  if (!tokens || tokens.length < 2) return null;

  const baseToken =
    tokens.find((t) =>
      ["WETH", "WBNB", "MATIC", "ETH"].includes(t.symbol.toUpperCase())
    ) || tokens[0];

  const stable =
    tokens.find((t) => t.symbol.toUpperCase() === "USDT") || tokens[1];

  // Avoid selecting the same token twice
  const tokenIn = baseToken;
  const tokenOut =
    stable.symbol === tokenIn.symbol
      ? tokens.find((t) => t.symbol !== tokenIn.symbol)!
      : stable;

  return { tokenIn, tokenOut };
}
