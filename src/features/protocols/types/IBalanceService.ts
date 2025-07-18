import { NormalizedToken } from "@/features/token/types/Token";

export interface IBalanceService {
  getTokens(address: string): Promise<NormalizedToken[]>;
  getOverview(address: string): Promise<{
    tokens: (NormalizedToken & { quote: number | null })[];
    totalUSD: number;
  }>;
  getTokenPrice(address: string, chainId: string | number): Promise<number>;
}
