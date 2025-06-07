import { BaseWalletProvider } from "./BaseWalletProvider";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class MetaMaskWallet extends BaseWalletProvider {
  id = "metamask";
  name = "MetaMask";
  icon = "/icons/metamask.svg";
  group = "main" as const;

  // 'as const' ensures the type is strictly 'main' (not just string),
  // matching the union type expected in the BaseWalletProvider (i.e., 'main' | 'top' | 'more').
  // Without it, TypeScript infers the type as a generic string, causing a type mismatch.

  isAvailable(): boolean {
    return (
      typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    );
  }

  async connect(): Promise<void> {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
}
