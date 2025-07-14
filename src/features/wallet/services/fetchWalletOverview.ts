import { ITokenBalance } from "../types/ITokenBalance";

export interface WalletOverview {
  tokens: ITokenBalance[];
  totalUSD: number;
}

export async function fetchWalletOverview(
  address: string,
  protocol: string
): Promise<WalletOverview> {
  const res = await fetch(
    `/api/wallet/overview?address=${address}&protocol=${protocol}`
  );
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error || "Failed to fetch wallet overview");
  }

  return {
    tokens: data.tokens,
    totalUSD: data.totalUSD,
  };
}
