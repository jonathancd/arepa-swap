"use client";

import { useWalletStore } from "@/features/wallet/hooks/useWalletStore";

export function NetworkStatus() {
  const { chainId } = useWalletStore();

  const isGoerli = chainId === 5;

  return (
    <div className="p-4 rounded-xl shadow bg-white dark:bg-zinc-900">
      <h2 className="text-sm text-muted-foreground">Active network</h2>
      <p
        className={`font-medium ${
          isGoerli ? "text-green-600" : "text-red-600"
        }`}
      >
        {chainId ? `Chain ID: ${chainId}` : "Unknown"}{" "}
        {isGoerli ? "(Goerli)" : "(No supported)"}
      </p>
    </div>
  );
}
