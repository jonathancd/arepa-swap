import { useEffect, useMemo, useRef } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { walletRegistry } from "../registry/walletRegistry";

export function useRestoreWallet() {
  const initialized = useRef(false);
  const wallets = useMemo(() => walletRegistry.getAll(), []); // Si no memo las wallets. se renderiza cada vez. porque registry cambia de referencia.
  const { setSelectedNetwork } = useNetworkStore();
  const { setAccount, setConnectedWallet, setProtocol } = useWalletStore();

  useEffect(() => {
    console.log("useRestoreWallet");
    if (initialized.current) return;
    initialized.current = true;

    const lastProvider = localStorage.getItem("wallet-provider");
    if (!lastProvider) return;

    const connected = wallets.find(
      (w) => w.id === lastProvider && w.isAvailable()
    );
    if (!connected) return;

    const fetchAccountInfo = async () => {
      const acc = await connected.getAccount();

      if (acc) {
        setAccount(acc);
        setProtocol(connected.protocol);
        setConnectedWallet(connected);
      }

      const net = await connected.getNetwork?.();
      if (net) setSelectedNetwork(net);
    };

    fetchAccountInfo();

    const accountHandler = () => fetchAccountInfo();
    const chainHandler = () => fetchAccountInfo();

    connected.onAccountChanged?.(accountHandler);
    connected.onChainChanged?.(chainHandler);

    return () => {
      connected.offListeners?.();

      // si el adapter no implementa offListeners:
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", accountHandler);
        window.ethereum.removeListener("chainChanged", chainHandler);
      }
    };
  }, [
    wallets,
    setAccount,
    setConnectedWallet,
    setProtocol,
    setSelectedNetwork,
  ]);

  // los metodos del store no cambian de referencia asi que no es necesario colocarlos como dependencias.
  // en desarrollo el useEffect se dispara dos veces.
}
