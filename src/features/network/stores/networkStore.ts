import { create } from "zustand";
import { INetwork } from "@/features/protocols/types/INetwork";

type NetworkStore = {
  selectedNetwork: INetwork | null;
  setSelectedNetwork: (network: INetwork) => void;

  isNetworkModalOpen: boolean;
  openNetworkModal: () => void;
  closeNetworkModal: () => void;
};

export const useNetworkStore = create<NetworkStore>((set) => ({
  selectedNetwork: null,
  isNetworkModalOpen: false,
  setSelectedNetwork: (network) => set({ selectedNetwork: network }),
  openNetworkModal: () => set({ isNetworkModalOpen: true }),
  closeNetworkModal: () => set({ isNetworkModalOpen: false }),
}));
