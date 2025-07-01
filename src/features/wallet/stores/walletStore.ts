import { create } from "zustand";
import { BaseWalletProvider } from "../lib/providers/BaseWalletProvider";
import { BrowserProvider, formatEther } from "ethers";

interface TokenBalance {
  contract_address: string;
  contract_name: string;
  contract_ticker_symbol: string;
  logo_url: string;
  balance: number;
  quote?: number;
  network?: string; // solo para multichain overview
}

interface WalletStore {
  account: string | null;
  balance: string | null;
  connectedWallet: BaseWalletProvider | null;
  networkTokenBalances: TokenBalance[]; // solo los tokens de la red activa
  overviewTokenBalances: TokenBalance[]; // tokens de todas las redes
  overviewTotalUSD: number;
  wallets: BaseWalletProvider[];
  connectWallet: (walletId: string) => Promise<void>;
  disconnectWallet: () => void;
  registerWallet: (wallet: BaseWalletProvider) => void;
  setAccount: (account: string | null) => void;
  setBalance: (balance: string | null) => void;
  setConnectedWallet: (connectedWallet: BaseWalletProvider | null) => void;
  setNetworkTokenBalances: (tokens: TokenBalance[]) => void;
  setOverviewTokenBalances: (tokens: TokenBalance[]) => void;
  setOverviewTotalUSD: (total: number) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  account: "",
  balance: "",
  connectedWallet: null,
  wallets: [],
  networkTokenBalances: [],
  overviewTokenBalances: [],
  overviewTotalUSD: 0,

  connectWallet: async (walletId) => {
    const wallet = get().wallets.find((w) => w.id === walletId);

    if (!wallet || !wallet.isAvailable()) return;

    await wallet.connect();
    const acc = await wallet.getAccount();
    const provider = new BrowserProvider(window.ethereum);
    const bal = acc ? await provider.getBalance(acc) : null;
    console.log("provider", provider);

    set({
      connectedWallet: wallet,
      account: acc,
      balance: bal ? parseFloat(formatEther(bal)).toFixed(4) : null,
    });

    console.log("seteando en el localStorage...", wallet.id);
    localStorage.setItem("wallet-provider", wallet.id);
  },
  disconnectWallet: () => {
    set({ connectedWallet: null, account: null, balance: null });
    console.log("disconnect wallet...");
    localStorage.removeItem("wallet-provider");
  },
  registerWallet: (wallet) =>
    set((state) => {
      if (!state.wallets.find((w) => w.id === wallet.id)) {
        return { wallets: [...state.wallets, wallet] };
      }
      return state;
    }),
  setAccount: (account) => set({ account }),
  setBalance: (balance) => set({ balance }),
  setConnectedWallet: (connectedWallet) => set({ connectedWallet }),
  setNetworkTokenBalances: (tokens) => set({ networkTokenBalances: tokens }),
  setOverviewTokenBalances: (tokens) => set({ overviewTokenBalances: tokens }),
  setOverviewTotalUSD: (total) => set({ overviewTotalUSD: total }),
}));
