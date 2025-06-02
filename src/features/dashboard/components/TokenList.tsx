"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { useWalletStore } from "@/features/wallet/hooks/useWalletStore";
import { useTokenBalances } from "@/features/dashboard/hooks/useTokenBalances";

export function TokenList() {
  const { account, chainId, provider } = useWalletStore();
  const balances = useTokenBalances(account ?? "", chainId);
  const [bnbBalance, setBnbBalance] = useState<string | null>(null);

  useEffect(() => {
    if (!account || !provider || chainId !== 56) return;

    provider.getBalance(account).then((raw) => {
      setBnbBalance(formatUnits(raw, 18));
    });
  }, [account, provider, chainId]);

  if (!account) {
    return (
      <p className="text-sm text-muted-foreground">
        Conecta tu wallet para ver tus tokens.
      </p>
    );
  }

  if (balances.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No se encontraron tokens con balance en esta red.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {balances.map((token) => (
        <div
          key={token.symbol}
          className="p-4 rounded-xl shadow bg-white dark:bg-zinc-900"
        >
          <h3 className="text-sm text-muted-foreground">{token.symbol}</h3>
          <p className="text-lg font-semibold">{token.balance}</p>
        </div>
      ))}
      {chainId === 56 && bnbBalance && (
        <div className="p-4 rounded-xl shadow bg-white dark:bg-zinc-900">
          <h3 className="text-sm text-muted-foreground">BNB</h3>
          <p className="text-lg font-semibold">{bnbBalance}</p>
        </div>
      )}
    </div>
  );
}
