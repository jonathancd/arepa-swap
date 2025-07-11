import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";

export function useRestoreWallet() {
  const { setSelectedNetwork } = useNetworkStore();
  const { wallets, setAccount, setConnectedWallet, setProtocol } =
    useWalletStore();

  useEffect(() => {
    const lastProvider = localStorage.getItem("wallet-provider");
    if (!lastProvider) return;

    const connected = wallets.find(
      (w) => w.id === lastProvider && w.isAvailable()
    );
    if (!connected) return;

    const fetchAccountInfo = async () => {
      const acc = await connected.getAccount();
      const net = await connected.getNetwork?.();

      setAccount(acc);
      setProtocol(connected.protocol);
      setConnectedWallet(connected);

      if (net) setSelectedNetwork(net);
    };

    fetchAccountInfo();

    connected.onAccountChanged?.(() => {
      fetchAccountInfo();
    });

    connected.onChainChanged?.(() => {
      fetchAccountInfo();
    });

    return () => {
      connected.offListeners?.();
    };
  }, [wallets]);

  // los metodos del store no cambian de referencia asi que no es necesario colocarlos como dependencias.
  // en desarrollo el useEffect se dispara dos veces.
}
