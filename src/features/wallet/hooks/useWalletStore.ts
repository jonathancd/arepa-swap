import { create } from "zustand";
import { IWalletConnector } from "../types/IWalletConnector";
import { MetaMaskConnector } from "../services/MetaMaskConnector";
import { IChainAdapter } from "@/features/chains/types/IChainAdapter";

type WalletState = {
  account: string | null;
  chainAdapter: IChainAdapter | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  selectedChainId: number | null;
  walletConnector: IWalletConnector | null;
  setWalletConnector: (connector: IWalletConnector) => void;
  setChainAdapter: (adapter: IChainAdapter | null) => void;
  setSelectedChainId: (id: number) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

export const useWalletStore = create<WalletState>((set, get) => {
  const connector = new MetaMaskConnector();

  return {
    account: null,
    chainAdapter: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    selectedChainId: 1,
    walletConnector: null,

    setWalletConnector: (connector) => set({ walletConnector: connector }),
    setChainAdapter: (adapter) => set({ chainAdapter: adapter }),
    setSelectedChainId: (id) => set({ selectedChainId: id }),

    connectWallet: async () => {
      //   console.log("ConnectWallet in useWalletStore...");
      //   const { walletConnector, isConnecting, isConnected } = get();

      //   if (!walletConnector) {
      //     console.warn("No wallet connector found");
      //     alert("Please select a wallet provider first.");
      //     return;
      //   }

      //   if (isConnecting) {
      //     console.log("Already connecting...");
      //     alert("Wallet connection is in progress. Please wait.");
      //     return;
      //   }

      //   if (isConnected) {
      //     console.log("Already connected");
      //     alert("You are already connected.");
      //     return;
      //   }

      //   set({ isConnecting: true });

      //   try {
      //     await walletConnector.connect();

      //     set({
      //       account: walletConnector.getAccount(),
      //       chainId: walletConnector.getChainId(),
      //       isConnected: walletConnector.isConnected(),
      //     });
      //   } catch (error) {
      //     console.error("Connection failed:", error);
      //   } finally {
      //     set({ isConnecting: false });
      //   }
      // },

      console.log("ConnectWallet in useWalletStore...");
      const { walletConnector, isConnecting, isConnected } = get();

      if (!walletConnector) {
        console.warn("No wallet connector found");
        alert("Please select a wallet provider first.");
        return;
      }

      if (isConnecting || isConnected) return;

      set({ isConnecting: true });

      try {
        await walletConnector.connect();

        const account = walletConnector.getAccount();
        const chainId = walletConnector.getChainId();

        set({
          account,
          chainId,
          selectedChainId: chainId, // 🔥 Esto activa useSyncChainAdapter
          isConnected: walletConnector.isConnected(),

          // account: walletConnector.getAccount(),
          //   chainId: walletConnector.getChainId(),
          //   isConnected: walletConnector.isConnected(),
        });
      } catch (error) {
        console.error("Connection failed:", error);
      } finally {
        set({ isConnecting: false });
      }
    },

    disconnectWallet: () => {
      const connector = get().walletConnector;
      if (connector) connector.disconnect();

      set({
        account: null,
        chainId: null,
        chainAdapter: null,
        isConnected: false,
        isConnecting: false,
      });
    },
  };
});
