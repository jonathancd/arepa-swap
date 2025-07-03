import { useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";
import { useWalletStore } from "@/features/wallet/stores/walletStore";

export function useRestoreWallet() {
  const { wallets, setAccount, setBalance, setProtocol } = useWalletStore();

  useEffect(() => {
    console.log("entra en el useEffect");
    const lastProvider = localStorage.getItem("wallet-provider");
    if (!lastProvider) return;

    const connected = wallets.find(
      (w) => w.id === lastProvider && w.isAvailable()
    );
    if (!connected) return;

    const fetchAccountInfo = async () => {
      const acc = await connected.getAccount();
      const provider = new BrowserProvider(window.ethereum);
      const bal = acc ? await provider.getBalance(acc) : null;

      setAccount(acc);
      setBalance(bal ? parseFloat(formatEther(bal)).toFixed(4) : null);
      setProtocol(connected.protocol);
    };

    fetchAccountInfo();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", fetchAccountInfo);
      window.ethereum.on("chainChanged", fetchAccountInfo);
    }

    return () => {
      window.ethereum?.removeListener("accountsChanged", fetchAccountInfo);
      window.ethereum?.removeListener("chainChanged", fetchAccountInfo);
    };
  }, [wallets]);

  // los metodos del store no cambian de referencia asi que no es necesario colocarlos como dependencias.
  // en desarrollo el useEffect se dispara dos veces.
}
