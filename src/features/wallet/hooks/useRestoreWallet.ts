import { useEffect, useMemo, useRef } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { walletRegistry } from "../registry/walletRegistry";
import { useInitializationStore } from "@/stores/initializationStore";

export function useRestoreWallet() {
  const initialized = useRef(false);
  const hookInitialized = useRef(false);

  if (!hookInitialized.current) {
    hookInitialized.current = true;
  }
  const wallets = useMemo(() => walletRegistry.getAll(), []); // Si no memo las wallets. se renderiza cada vez. porque registry cambia de referencia.
  const { setSelectedNetwork } = useNetworkStore();
  const { setAccount, setConnectedWallet, setProtocol } = useWalletStore();
  const {
    protocolInitialized,
    networkInitialized,
    setWalletRestored,
    setError,
  } = useInitializationStore();

  useEffect(() => {
    // Esperar a que protocolo y red estén inicializados
    if (!protocolInitialized || !networkInitialized) {
      return;
    }

    // Solo ejecutar una vez cuando esté listo
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const lastProvider = localStorage.getItem("wallet-provider");
    if (!lastProvider) {
      setWalletRestored();
      return;
    }

    const connected = wallets.find(
      (w) => w.id === lastProvider && w.isAvailable()
    );
    if (!connected) {
      setWalletRestored();
      return;
    }

    const fetchAccountInfo = async () => {
      try {
        const acc = await connected.getAccount();

        if (acc) {
          setAccount(acc);
          setProtocol(connected.protocol);
          setConnectedWallet(connected);
        }

        const net = await connected.getNetwork?.();
        if (net) {
          setSelectedNetwork(net);
        }

        setWalletRestored();
      } catch (error) {
        console.error("[useRestoreWallet] Error restoring wallet:", error);
        setError("Failed to restore wallet");
      }
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
    protocolInitialized,
    networkInitialized,
    setWalletRestored,
    setError,
  ]);

  // los metodos del store no cambian de referencia asi que no es necesario colocarlos como dependencias.
  // en desarrollo el useEffect se dispara dos veces.
}
