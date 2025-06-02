import { TokenInfo } from "@/lib/types/token";
import { ethers } from "ethers";

export interface IChainAdapter {
  name: string;
  chainId: number;
  nativeSymbol: string;
  isTestnet: boolean;
  getNativeBalance(address: string): Promise<string>;
  getTokenList(): Promise<TokenInfo[]>;
  getProvider(): ethers.Provider;
}
