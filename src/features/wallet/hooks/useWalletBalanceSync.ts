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
        const newBalance = await connectedWallet.getBalance(account);
        const currentBalance = useWalletStore.getState().balance;

        if (newBalance !== currentBalance) {
          setBalance(newBalance);
        }
      };

      fetchBalance();
      interval = setInterval(fetchBalance, 15000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [connectedWallet, account, setBalance]);
  /**
   * Syncs wallet balance either via wallet events or polling.
   *
   * If the connected wallet supports `onBalanceChanged`, use it to subscribe to real-time balance updates.
   * Otherwise, falls back to polling every 15s.
   *
   * NOTE: This hook will trigger Zustand store updates using `setBalance`.
   *    Any React component that **subscribes to `balance` in the store** will re-render every time this value changes,
   *    even if the value is the same.
   *
   * Optimization: We compare the new balance with the current one before setting it,
   *    to avoid unnecessary re-renders across the app.
   */
}
