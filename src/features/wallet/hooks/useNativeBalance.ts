import { useEffect, useState } from "react";
import { IChainAdapter } from "@/features/chains/types/IChainAdapter";

export function useNativeBalance(
  account: string | null,
  adapter: IChainAdapter | null,
  isConnected: boolean
) {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const loadBalance = async () => {
      if (!account || !adapter || !isConnected) {
        setBalance("");
        return;
      }

      const result = await adapter.getNativeBalance(account);
      console.log(result);
      setBalance(result);
    };

    loadBalance();
  }, [account, adapter, isConnected]);

  return balance;
}
