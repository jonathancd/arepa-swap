import { create } from "zustand";
import { BaseWalletProvider } from "../lib/providers/BaseWalletProvider";
import { BrowserProvider, formatEther } from "ethers";
import { Protocol } from "@/features/protocols/constants/Protocol";

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
  wallets: BaseWalletProvider[];
  connectedWallet: BaseWalletProvider | null;
  protocol: Protocol | null; // Nuevo: para saber si es EVM o Solana

  account: string | null;
  balance: string | null;

  networkTokenBalances: TokenBalance[];
  overviewTokenBalances: TokenBalance[];
  overviewTotalUSD: number;

  registerWallet: (wallet: BaseWalletProvider) => void;
  connectWallet: (walletId: string) => Promise<void>;
  disconnectWallet: () => void;

  setAccount: (account: string | null) => void;
  setBalance: (balance: string | null) => void;
  setConnectedWallet: (wallet: BaseWalletProvider | null) => void;
  setProtocol: (protocol: Protocol | null) => void;

  setNetworkTokenBalances: (tokens: TokenBalance[]) => void;
  setOverviewTokenBalances: (tokens: TokenBalance[]) => void;
  setOverviewTotalUSD: (total: number) => void;
}

// interface WalletStore {
//   account: string | null;
//   balance: string | null;
//   connectedWallet: BaseWalletProvider | null;
//   networkTokenBalances: TokenBalance[]; // solo los tokens de la red activa
//   overviewTokenBalances: TokenBalance[]; // tokens de todas las redes
//   overviewTotalUSD: number;
//   wallets: BaseWalletProvider[];
//   connectWallet: (walletId: string) => Promise<void>;
//   disconnectWallet: () => void;
//   registerWallet: (wallet: BaseWalletProvider) => void;
//   setAccount: (account: string | null) => void;
//   setBalance: (balance: string | null) => void;
//   setConnectedWallet: (connectedWallet: BaseWalletProvider | null) => void;
//   setNetworkTokenBalances: (tokens: TokenBalance[]) => void;
//   setOverviewTokenBalances: (tokens: TokenBalance[]) => void;
//   setOverviewTotalUSD: (total: number) => void;
// }

export const useWalletStore = create<WalletStore>((set, get) => ({
  connectedWallet: null,
  protocol: null,
  wallets: [],

  account: "",
  balance: "",

  networkTokenBalances: [],
  overviewTokenBalances: [],
  overviewTotalUSD: 0,

  connectWallet: async (walletId) => {
    const wallet = get().wallets.find((w) => w.id === walletId);
    if (!wallet || !wallet.isAvailable()) return;

    await wallet.connect();
    const account = await wallet.getAccount();
    const protocol = wallet.protocol;
    const balance = account ? await wallet.getBalance(account) : null;

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
      balance,
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
  setProtocol: (protocol) => set({ protocol }),
  setNetworkTokenBalances: (tokens) => set({ networkTokenBalances: tokens }),
  setOverviewTokenBalances: (tokens) => set({ overviewTokenBalances: tokens }),
  setOverviewTotalUSD: (total) => set({ overviewTotalUSD: total }),
}));
