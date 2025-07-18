import { create } from "zustand";
import { IToken } from "@/features/token/types/IToken";
import { INetwork } from "@/features/protocols/types/INetwork";
import { ISwapAdapter } from "../types/ISwapAdapter";
import { SWAP_MODES } from "../constants/swapModes";
import type { ISwapMode } from "../types/ISwapMode";

export type SwapConfig = {
  fromToken: IToken | null;
  toToken: IToken | null;
  fromNetwork: INetwork | null;
  toNetwork: INetwork | null;
  swapAdapter: ISwapAdapter | null;
};

interface SwapStore {
  config: SwapConfig;
  swapMode: ISwapMode;
  setFromToken: (token: IToken | null) => void;
  setToToken: (token: IToken | null) => void;
  setNetworks: (from: INetwork, to?: INetwork) => void;
  setSwapAdapter: (adapter: ISwapAdapter | null) => void;
  swapTokens: () => void;
  resetTokens: () => void;
  setSwapMode: (mode: ISwapMode) => void;
}

export const useSwapStore = create<SwapStore>((set, get) => ({
  config: {
    fromToken: null,
    toToken: null,
    fromNetwork: null,
    toNetwork: null,
    swapAdapter: null,
  },
  swapMode: SWAP_MODES[0]?.key,

  setFromToken: (token) => {
    const { config } = get();
    if (token && token.address === config.toToken?.address) {
      set((state) => ({
        config: { ...state.config, fromToken: token, toToken: null },
      }));
    } else {
      set((state) => ({ config: { ...state.config, fromToken: token } }));
    }
  },

  setToToken: (token) => {
    const { config } = get();
    if (token && token.address === config.fromToken?.address) {
      set((state) => ({
        config: { ...state.config, toToken: null },
      }));
    } else {
      set((state) => ({ config: { ...state.config, toToken: token } }));
    }
  },

  setNetworks: (from, to = from) => {
    set((state) => ({
      config: { ...state.config, fromNetwork: from, toNetwork: to },
    }));
  },

  setSwapAdapter: (adapter) => {
    set((state) => ({
      config: { ...state.config, swapAdapter: adapter },
    }));
  },

  swapTokens: () => {
    set((state) => ({
      config: {
        fromToken: state.config.toToken,
        toToken: state.config.fromToken,
        fromNetwork: state.config.toNetwork,
        toNetwork: state.config.fromNetwork,
        swapAdapter: state.config.swapAdapter, // Mantener adapter si es cross-chain-ready
      },
    }));
  },

  resetTokens: () => {
    set((state) => ({
      config: {
        ...state.config,
        fromToken: null,
        toToken: null,
      },
    }));
  },

  setSwapMode: (mode) => set({ swapMode: mode }),
}));
