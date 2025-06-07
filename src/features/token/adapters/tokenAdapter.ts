import type { RawTokenDTO, NormalizedToken } from "../types/Token";

export function normalizeToken(
  raw: RawTokenDTO,
  network: string
): NormalizedToken {
  return {
    contract_address: raw.token_address,
    contract_name: raw.name,
    contract_ticker_symbol: raw.symbol,
    logo_url: raw.logo || "",
    decimals: raw.decimals ?? 18,
    balance: Number(raw.balance) / Math.pow(10, raw.decimals || 18),
    network,
  };
}

export function isSuspiciousToken(token: NormalizedToken): boolean {
  const symbol = token.contract_ticker_symbol.toLowerCase();
  const name = token.contract_name.toLowerCase();

  return (
    !token.contract_address ||
    symbol.length > 10 ||
    symbol.includes(".") ||
    name.includes(".") ||
    !token.logo_url ||
    token.decimals === 0 ||
    token.decimals > 18
  );
}

export function enrichWithQuote(token: NormalizedToken, price: number) {
  const quote = token.balance * price;
  const isSuspicious =
    isSuspiciousToken(token) ||
    !Number.isFinite(quote) ||
    quote < 0 ||
    quote > 10000 ||
    price === 0;

  return {
    ...token,
    quote: isSuspicious ? null : quote,
    is_suspicious: isSuspicious,
  };
}
