import { TokenRegistry } from "../registry/tokenRegistry";
import { DefaultSwapTokens } from "../types/IDefaultSwapTokens";

export function getDefaultTokensForNetwork(
  networkId: number
): DefaultSwapTokens | null {
  const tokens = TokenRegistry[networkId];
  if (!tokens || tokens.length === 0) return null;

  const tokenIn = tokens.find((t) => t.isNative) || tokens[0];

  const stableSymbols = ["USDT", "USDC", "DAI"];
  let tokenOut =
    tokens.find(
      (t) =>
        stableSymbols.includes(t.symbol.toUpperCase()) &&
        t.symbol !== tokenIn.symbol
    ) ||
    tokens.find((t) => t.symbol !== tokenIn.symbol) ||
    tokens[1] ||
    tokenIn; // fallback: si solo hay uno

  // Si por alguna razón tokenIn y tokenOut son iguales, busca el siguiente diferente
  if (tokenOut.symbol === tokenIn.symbol) {
    tokenOut = tokens.find((t) => t.symbol !== tokenIn.symbol) || tokenIn;
  }

  return { tokenIn, tokenOut };
}
