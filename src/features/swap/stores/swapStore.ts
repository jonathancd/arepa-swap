import { create } from "zustand";
import { BaseSwapAdapter } from "../adapters/BaseSwapAdapter";
import { IToken } from "@/features/token/types/IToken";
import { INetwork } from "@/features/protocols/types/INetwork";
import { ISwapAdapter } from "../types/ISwapAdapter";

interface SwapStore {
  activeSwapAdapter: BaseSwapAdapter | null;
  tokenIn: IToken | null;
  tokenOut: IToken | null;

  setActiveSwapAdapter: (adapter: BaseSwapAdapter | null) => void;
  setTokenIn: (token: IToken) => void;
  setTokenOut: (token: IToken) => void;
}

export const useSwapStore = create<SwapStore>((set) => ({
  activeSwapAdapter: null,
  tokenIn: null,
  tokenOut: null,

  setActiveSwapAdapter: (adapter) => set({ activeSwapAdapter: adapter }),
  setTokenIn: (token) => set({ tokenIn: token }),
  setTokenOut: (token) => set({ tokenOut: token }),
}));
