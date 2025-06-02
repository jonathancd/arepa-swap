"use client";

import { useWalletStore } from "@/features/wallet/hooks/useWalletStore";

export function WalletInfo() {
  const { account, isConnected, disconnectWallet } = useWalletStore();

  if (!isConnected) return null;

  return (
    <div className="p-4 rounded-xl shadow bg-white dark:bg-zinc-900 flex justify-between items-center">
      <div>
        <h2 className="text-sm text-muted-foreground">Connected as:</h2>
        <p className="text-sm font-medium">{account}</p>
      </div>
      <button
        onClick={disconnectWallet}
        className="px-4 py-2 rounded bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      >
        Disconnect
      </button>
    </div>
  );
}
