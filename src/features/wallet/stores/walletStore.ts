import { create } from "zustand";
import { BaseWalletAdapter } from "../adapters/BaseWalletAdapter";
import { Protocol } from "@/features/protocols/constants/Protocol";
import { walletRegistry } from "../registry/walletRegistry";
import { ITokenBalance } from "../types/ITokenBalance";

interface WalletStore {
  // Estado del wallet
  account: string | null;
  connectedWallet: BaseWalletAdapter | null;
  protocol: Protocol | null;
  balance: string | null;

  // Estado de la UI
  isConnectModalOpen: boolean;
  isOverviewModalOpen: boolean;

  // Datos del wallet
  overviewTokenBalances: ITokenBalance[];
  overviewTotalUSD: number;
  isOverviewLoading: boolean;

  // Actions
  setAccount: (account: string | null) => void;
  setConnectedWallet: (wallet: BaseWalletAdapter | null) => void;
  setProtocol: (protocol: Protocol | null) => void;
  setBalance: (balance: string | null) => void;
  setIsConnectModalOpen: (open: boolean) => void;
  setIsOverviewModalOpen: (open: boolean) => void;
  setOverviewTokenBalances: (balances: ITokenBalance[]) => void;
  setOverviewTotalUSD: (total: number) => void;
  setIsOverviewLoading: (loading: boolean) => void;

  // UI Actions
  openOverviewModal: () => void;
  closeOverviewModal: () => void;
  disconnectWallet: () => void;
  connectWallet: (walletId: string) => Promise<void>;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Estado del wallet
  account: null,
  connectedWallet: null,
  protocol: null,
  balance: null,

  // Estado de la UI
  isConnectModalOpen: false,
  isOverviewModalOpen: false,

  // Datos del wallet
  overviewTokenBalances: [],
  overviewTotalUSD: 0,
  isOverviewLoading: false,

  // Actions
  setAccount: (account) => set({ account }),
  setConnectedWallet: (wallet) => set({ connectedWallet: wallet }),
  setProtocol: (protocol) => set({ protocol }),
  setBalance: (balance) => set({ balance }),
  setIsConnectModalOpen: (open) => set({ isConnectModalOpen: open }),
  setIsOverviewModalOpen: (open) => set({ isOverviewModalOpen: open }),
  setOverviewTokenBalances: (balances) =>
    set({ overviewTokenBalances: balances }),
  setOverviewTotalUSD: (total) => set({ overviewTotalUSD: total }),
  setIsOverviewLoading: (loading) => set({ isOverviewLoading: loading }),

  // UI Actions
  openOverviewModal: () => set({ isOverviewModalOpen: true }),
  closeOverviewModal: () => set({ isOverviewModalOpen: false }),
  disconnectWallet: () => {
    set({
      connectedWallet: null,
      account: null,
      balance: null,
      protocol: null,
      isOverviewModalOpen: false,
    });
    localStorage.removeItem("wallet-provider");
  },
  connectWallet: async (walletId: string) => {
    const wallet = walletRegistry.get(walletId);
    if (!wallet || !wallet.isAvailable()) return;

    await wallet.connect();
    const account = await wallet.getAccount();
    const protocol = wallet.protocol;

    set({
      connectedWallet: wallet,
      protocol,
      account,
    });

    localStorage.setItem("wallet-provider", wallet.id);
  },
}));
