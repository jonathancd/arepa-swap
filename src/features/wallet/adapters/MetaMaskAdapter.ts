import { BrowserProvider, formatEther, Signer } from "ethers";
import { BaseWalletAdapter } from "./BaseWalletAdapter";
import { Protocol } from "@/features/protocols/constants/Protocol";
import { findEvmNetworkByHex } from "@/features/protocols/evm/utils/evmNetworkUtils";
import { IEvmNetwork } from "@/features/protocols/evm/types/IEvmNetwork";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class MetaMaskAdapter extends BaseWalletAdapter {
  id = "metamask";
  name = "MetaMask";
  icon = "/icons/wallets/metamask.svg";
  group = "top" as const;
  protocol = Protocol.EVM;

  private _accountListener?: (accounts: string[]) => void;
  private _chainListener?: () => void;

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

  async getNetwork(): Promise<IEvmNetwork | null> {
    const chainId = await window.ethereum?.request({ method: "eth_chainId" });
    return findEvmNetworkByHex(chainId || "") || null;
  }

  async getSigner(): Promise<Signer | null> {
    const provider = new BrowserProvider(window.ethereum);
    // const accounts = await provider.send("eth_accounts", []);
    const account = this.getAccount();

    if (!account) return null;

    // getSigner() en ethers.js hace internamente una llamada a: window.ethereum.request({ method: "eth_requestAccounts" });
    // Y ES ESE método el que abre el modal de conexión si el usuario no ha autorizado aún.
    return await provider.getSigner();
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

  onAccountChanged(handler: (acc: string) => void): void {
    this._accountListener = (accounts: string[]) => handler(accounts[0]);
    window.ethereum?.on("accountsChanged", this._accountListener);
  }

  onChainChanged(handler: () => void): void {
    this._chainListener = handler;
    window.ethereum?.on("chainChanged", this._chainListener);
  }

  offListeners(): void {
    if (this._accountListener) {
      window.ethereum?.removeListener("accountsChanged", this._accountListener);
      this._accountListener = undefined;
    }

    if (this._chainListener) {
      window.ethereum?.removeListener("chainChanged", this._chainListener);
      this._chainListener = undefined;
    }
  }
}
