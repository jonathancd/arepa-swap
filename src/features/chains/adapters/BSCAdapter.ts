import { ethers, formatUnits } from "ethers";
import { IChainAdapter } from "../types/IChainAdapter";
import { TokenInfo } from "@/lib/types/token";
import { TOKENS_BSC } from "../constants/tokenLists"; // temporal

export class BSCAdapter implements IChainAdapter {
  name = "Binance Smart Chain";
  chainId = 56;
  nativeSymbol = "BNB";
  isTestnet = false;

  private provider: ethers.BrowserProvider;

  constructor() {
    if (!window.ethereum) {
      throw new Error(
        "No wallet provider found (window.ethereum is undefined)"
      );
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
  }

  async getNativeBalance(address: string) {
    const balance = await this.provider.getBalance(address);
    console.log("BSC Adapter");
    console.log("Active address:", address);
    console.log("Network (chainId):", await this.provider.getNetwork());
    console.log(
      "Balance:",
      (await this.provider.getBalance(address)).toString()
    );

    console.log("RAW balance (wei):", balance.toString()); // <-- importante
    console.log("Formatted:", formatUnits(balance, 18));

    return formatUnits(balance, 18);
  }

  async getTokenList(): Promise<TokenInfo[]> {
    return TOKENS_BSC;
  }

  getProvider() {
    return this.provider;
  }
}
