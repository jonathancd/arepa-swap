import { IWalletProvider } from "../../types/IWalletProvider";

export abstract class BaseWalletProvider implements IWalletProvider {
  abstract id: string;
  abstract name: string;
  abstract icon: string;
  abstract group: "main" | "top" | "more";

  abstract isAvailable(): boolean;
  abstract connect(): Promise<void>;

  async getAccount(): Promise<string | null> {
    const accounts = await window.ethereum?.request({ method: "eth_accounts" });
    return accounts?.[0] || null;
  }

  async getNetwork(): Promise<string | null> {
    const chainId = await window.ethereum?.request({ method: "eth_chainId" });
    return chainId || null;
  }

  async switchNetwork(chainIdHex: string): Promise<void> {
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      console.error("Network switch failed:", error);
    }
  }
}
