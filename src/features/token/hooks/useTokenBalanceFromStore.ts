import { useMemo } from "react";
import { IToken } from "../types/IToken";
import { useWalletStore } from "@/features/wallet/stores/walletStore";

/**
 * Gets the balance of a given token from overviewTokenBalances in walletStore.
 */
export function useTokenBalanceFromStore(token: IToken | null) {
  const { overviewTokenBalances } = useWalletStore();

  const balance = useMemo(() => {
    if (!token || !token.address) return 0;

    const matched = overviewTokenBalances.find(
      (t) => t.contract_address.toLowerCase() === token.address.toLowerCase()
    );

    return matched ? matched.balance.toString() : 0;
  }, [token, overviewTokenBalances]);
  return balance;
}
