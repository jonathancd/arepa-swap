"use client";

import { useConnectorManager } from "../hooks/useConnectorManager";
import { MetaMaskConnector } from "../services/MetaMaskConnector";
import { useEthereumEvents } from "../hooks/useEthereumEvents";
import { useSyncChainAdapter } from "../hooks/useSynchChainAdapter";

export function WalletSelector() {
  // Escucha cambios en MetaMask (como chainChanged, accountsChanged)
  useEthereumEvents();

  // Sincroniza adapter y red real según selectedChainId
  useSyncChainAdapter();

  const {
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
    setWalletConnector,
  } = useConnectorManager();

  const handleConnect = async () => {
    const connector = new MetaMaskConnector();
    setWalletConnector(connector);
    await connectWallet(); // Ya se encarga de usar el chainAdapter actual
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <button
      onClick={isConnected ? handleDisconnect : handleConnect}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-indigo-700"
    >
      {isConnected
        ? `Disconnect (${account?.slice(0, 6)}...)`
        : "Connect wallet"}
    </button>
  );
}
