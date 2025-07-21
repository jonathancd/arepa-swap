import { IToken } from "../types/IToken";

export async function resolveTokenAddress(
  symbol: string,
  chainId: number
): Promise<IToken> {
  const res = await fetch(
    `/api/tokens/resolve-address?symbol=${encodeURIComponent(
      symbol
    )}&chainId=${chainId}`
  );
  if (!res.ok) throw new Error("No se pudo resolver la address");
  return await res.json();
}
