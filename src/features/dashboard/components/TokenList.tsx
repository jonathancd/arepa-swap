"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { useWalletStore } from "@/features/wallet/hooks/useWalletStore";
import { useTokenBalances } from "@/features/dashboard/hooks/useTokenBalances";
import { CHAIN_REGISTRY } from "@/features/chains/registry/chainRegistry";

export function TokenList() {
  const { account, chainId, chainAdapter } = useWalletStore();
  const balances = useTokenBalances(account ?? "", chainId);
  const [nativeBalance, setNativeBalance] = useState<string | null>(null);

  if (!chainId) return null;

  useEffect(() => {
    if (!account || !chainAdapter) return;

    chainAdapter
      .getProvider()
      .getBalance(account)
      .then((raw: bigint) => setNativeBalance(formatUnits(raw, 18)));
  }, [account, chainAdapter]);

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
      {nativeBalance && (
        <div className="p-4 rounded-xl shadow bg-white dark:bg-zinc-900">
          <h3 className="text-sm text-muted-foreground">
            {CHAIN_REGISTRY[chainId]?.nativeSymbol ?? "NATIVE"}
          </h3>
          <p className="text-lg font-semibold">{nativeBalance}</p>
        </div>
      )}
    </div>
  );
}
