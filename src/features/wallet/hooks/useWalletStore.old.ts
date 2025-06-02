// Feature Folder Pattern
import { create } from "zustand";
import { ethers } from "ethers";

type WalletState = {
  account: string | null;
  chainId: number | null;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  account: null,
  chainId: null,
  provider: null,
  signer: null,
  isConnected: false,

  connectWallet: async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      set({
        account: accounts[0],
        chainId: Number(network.chainId),
        provider,
        signer,
        isConnected: true,
      });
    } catch (error) {
      console.log(error);
      alert("Connection lost");
    }
  },

  disconnectWallet: () => {
    set({
      account: null,
      chainId: null,
      provider: null,
      signer: null,
      isConnected: false,
    });
  },
}));
