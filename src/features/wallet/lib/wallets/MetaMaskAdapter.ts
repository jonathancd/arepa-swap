import { BrowserProvider, formatEther } from "ethers";
import { BaseWalletProvider } from "../providers/BaseWalletProvider";
import { Protocol } from "@/features/protocols/constants/Protocol";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class MetaMaskAdapter extends BaseWalletProvider {
  id = "metamask";
  name = "MetaMask";
  icon = "/icons/wallets/metamask.svg";
  group = "top" as const;
  protocol = Protocol.EVM;

  isAvailable(): boolean {
    return (
      typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    );
  }

  async connect(): Promise<void> {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async getAccount(): Promise<string | null> {
    const accounts = await window.ethereum?.request({ method: "eth_accounts" });
    return accounts?.[0] || null;
  }

  async getBalance(account: string): Promise<string | null> {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const rawBalance = await provider.getBalance(account);
      return parseFloat(formatEther(rawBalance)).toFixed(4);
    } catch {
      return null;
    }
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
