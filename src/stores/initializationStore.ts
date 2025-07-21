import { create } from "zustand";

export type InitializationStep =
  | "idle"
  | "protocol_set"
  | "network_set"
  | "wallet_restored"
  | "ready"
  | "error";

interface InitializationStore {
  currentStep: InitializationStep;
  error: string | null;

  protocolInitialized: boolean;
  networkInitialized: boolean;
  walletRestored: boolean;

  // Actions
  setError: (error: string | null) => void;
  setProtocolInitialized: () => void;
  setNetworkInitialized: () => void;
  setWalletRestored: () => void;

  // Computed
  isReady: () => boolean;
  canProceedToSwap: () => boolean;
}

export const useInitializationStore = create<InitializationStore>(
  (set, get) => ({
    currentStep: "idle",
    error: null,

    protocolInitialized: false,
    networkInitialized: false,
    walletRestored: false,

    setError: (error) => set({ error }),

    setProtocolInitialized: () => {
      set({ protocolInitialized: true });
      const { networkInitialized } = get();
      if (networkInitialized) {
        set({ currentStep: "network_set" });
      }
    },

    setNetworkInitialized: () => {
      set({ networkInitialized: true });
      const { protocolInitialized } = get();
      if (protocolInitialized) {
        set({ currentStep: "network_set" });
      }
    },

    setWalletRestored: () => {
      set({
        walletRestored: true,
        currentStep: "wallet_restored",
      });
    },

    isReady: () => {
      const { protocolInitialized, networkInitialized, walletRestored } = get();
      console.log({ protocolInitialized, networkInitialized, walletRestored });
      return protocolInitialized && networkInitialized && walletRestored;
    },

    canProceedToSwap: () => {
      return get().isReady();
    },
  })
);
