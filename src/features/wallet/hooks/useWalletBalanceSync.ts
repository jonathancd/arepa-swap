import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";

/**
 * Sync wallet balance on account or provider change.
 * Uses `onBalanceChanged` if available, otherwise falls back to polling.
 */
export function useWalletBalanceSync() {
  const { account, connectedWallet, setBalance } = useWalletStore();

  useEffect(() => {
    if (!connectedWallet || !account) return;

    const supportsEvent =
      typeof connectedWallet.onBalanceChanged === "function";
    let interval: NodeJS.Timeout | undefined;

    if (supportsEvent) {
      connectedWallet.onBalanceChanged!(account, setBalance);

      return () => {
        connectedWallet.offBalanceChanged?.();
      };
    } else {
      // Fallback: polling cada 15s
      const fetchBalance = async () => {
        const balance = await connectedWallet.getBalance(account);
        setBalance(balance);
      };

      fetchBalance();
      interval = setInterval(fetchBalance, 15000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [connectedWallet, account, setBalance]);
}
