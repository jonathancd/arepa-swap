"use client";

import { useWalletStore } from "@hooks/useWalletStore";

export function WalletConnectButton() {
  const { account, isConnected, connectWallet, disconnectWallet } =
    useWalletStore();

  return (
    <button
      onClick={isConnected ? disconnectWallet : connectWallet}
      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
    >
      {isConnected
        ? `${account?.slice(0, 6)}...${account?.slice(-4)} (Desconectar)`
        : "Conectar Wallet"}
    </button>
  );
}
