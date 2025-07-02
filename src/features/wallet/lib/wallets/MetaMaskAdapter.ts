// import { BaseWalletProvider } from "./BaseWalletProvider";

// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// export class MetaMaskWallet extends BaseWalletProvider {
//   id = "metamask";
//   name = "MetaMask";
//   icon = "/icons/metamask.svg";
//   group = "main" as const;

//   // 'as const' ensures the type is strictly 'main' (not just string),
//   // matching the union type expected in the BaseWalletProvider (i.e., 'main' | 'top' | 'more').
//   // Without it, TypeScript infers the type as a generic string, causing a type mismatch.

//   isAvailable(): boolean {
//     return (
//       typeof window !== "undefined" && typeof window.ethereum !== "undefined"
//     );
//   }

//   async connect(): Promise<void> {
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//   }
// }

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
  icon = "/icons/metamask.svg";
  group = "main" as const;
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
