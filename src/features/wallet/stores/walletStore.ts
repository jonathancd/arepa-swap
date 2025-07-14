import { create } from "zustand";
import { BaseWalletAdapter } from "../adapters/BaseWalletAdapter";
import { Protocol } from "@/features/protocols/constants/Protocol";
import { walletRegistry } from "../registry/walletRegistry";
import { ITokenBalance } from "../types/ITokenBalance";

interface WalletStore {
  connectedWallet: BaseWalletAdapter | null;
  protocol: Protocol | null; // Nuevo: para saber si es EVM o Solana

  account: string | null;
  balance: string | null;

  overviewTokenBalances: ITokenBalance[];
  overviewTotalUSD: number;

  isConnectModalOpen: boolean;
  isOverviewModalOpen: boolean;
  isOverviewLoading: boolean;

  connectWallet: (walletId: string) => Promise<void>;
  disconnectWallet: () => void;

  setAccount: (account: string | null) => void;
  setBalance: (balance: string | null) => void;
  setConnectedWallet: (wallet: BaseWalletAdapter | null) => void;
  setProtocol: (protocol: Protocol | null) => void;

  setOverviewTokenBalances: (tokens: ITokenBalance[]) => void;
  setOverviewTotalUSD: (total: number) => void;

  closeOverviewModal: () => void;
  openOverviewModal: () => void;

  setIsConnectModalOpen: (value: boolean) => void;
  setIsOverviewLoading: (value: boolean) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  connectedWallet: null,
  protocol: null,

  account: "",
  balance: "",

  overviewTokenBalances: [],
  overviewTotalUSD: 0,

  isConnectModalOpen: false,
  isOverviewModalOpen: false,
  isOverviewLoading: false,

  connectWallet: async (walletId) => {
    const wallet = walletRegistry.get(walletId);
    if (!wallet || !wallet.isAvailable()) return;

    await wallet.connect();
    const account = await wallet.getAccount();
    const protocol = wallet.protocol;

    // Antes se calculaba el balance directamente aquí según el protocolo.
    // Eso violaba el principio de Inversión de Dependencias (D de SOLID),
    // ya que este store (módulo de alto nivel) dependía de lógica de bajo nivel (EVM, ethers).
    // Ahora se delega al adapter correspondiente con `wallet.getBalance(account)`,
    // lo que permite mantener el store desacoplado del protocolo.

    // let balance: string | null = null;
    // // EVM: obtener balance con ethers
    // if (protocol === Protocol.EVM && account) {
    //   const provider = new BrowserProvider(window.ethereum);
    //   const rawBalance = await provider.getBalance(account);
    //   balance = parseFloat(formatEther(rawBalance)).toFixed(4);
    // }

    set({
      connectedWallet: wallet,
      protocol,
      account,
    });

    localStorage.setItem("wallet-provider", wallet.id);
  },
  disconnectWallet: () => {
    set({
      connectedWallet: null,
      account: null,
      balance: null,
      protocol: null,
    });

    localStorage.removeItem("wallet-provider");
  },
  setAccount: (account) => set({ account }),
  setBalance: (balance) => set({ balance }),
  setConnectedWallet: (connectedWallet) => set({ connectedWallet }),
  setProtocol: (protocol) => set({ protocol }),
  setOverviewTokenBalances: (tokens) => set({ overviewTokenBalances: tokens }),
  setOverviewTotalUSD: (total) => set({ overviewTotalUSD: total }),
  closeOverviewModal: () => set({ isOverviewModalOpen: false }),
  openOverviewModal: () => set({ isOverviewModalOpen: true }),
  setIsConnectModalOpen: (value: boolean) => set({ isConnectModalOpen: value }),
  setIsOverviewLoading: (value: boolean) => set({ isOverviewLoading: value }),
}));
