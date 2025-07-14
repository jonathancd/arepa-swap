import { create } from "zustand";
import { BaseSwapAdapter } from "../adapters/BaseSwapAdapter";

interface SwapStore {
  activeSwapAdapter: BaseSwapAdapter | null;
  setActiveSwapAdapter: (adapter: BaseSwapAdapter | null) => void;
}

export const useSwapStore = create<SwapStore>((set) => ({
  activeSwapAdapter: null,
  setActiveSwapAdapter: (adapter) => set({ activeSwapAdapter: adapter }),
}));
