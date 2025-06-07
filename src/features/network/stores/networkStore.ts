import { create } from "zustand";
import { INetwork } from "../types/INetwork";

type NetworkStore = {
  selectedNetwork: INetwork | null;
  setSelectedNetwork: (network: INetwork) => void;
};

export const useNetworkStore = create<NetworkStore>((set) => ({
  selectedNetwork: null,
  setSelectedNetwork: (network) => set({ selectedNetwork: network }),
}));
