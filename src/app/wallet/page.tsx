"use client";

import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/hooks/useWalletStore";
import { useNativeBalance } from "@/features/wallet/hooks/useNativeBalance";
import { CHAIN_REGISTRY } from "@/features/chains/registry/chainRegistry";

// import { TokenList, WalletInfo, NetworkStatus } from "@/features/dashboard";

export default function WalletPage() {
  const {
    account,
    chainId,
    chainAdapter,
    isConnected,
    isConnecting,
    walletConnector,
    connectWallet,
  } = useWalletStore();
  const nativeBalance = useNativeBalance(account, chainAdapter, isConnected);
  const networkInfo = chainId ? CHAIN_REGISTRY[chainId] : null;

  // const { isConnecting, isConnected, walletConnector, connectWallet } =
  //   useWalletStore();

  useEffect(() => {
    if (walletConnector && !isConnected && !isConnecting) {
      connectWallet();
    }
  }, [walletConnector, isConnected, isConnecting]);

  return (
    <div className="p-4 space-y-4">
      {/* <WalletInfo />
      <NetworkStatus />
      <TokenList /> */}
      <h1 className="text-xl font-bold">Wallet Dashboard</h1>

      <p>Account: {account ?? "Not connected"}</p>

      {/* As we are using window.ethereum, we keep receiving events when network change (chainChanged) from Metamask */}
      {/* When changing the network from Metamask, the chainId is updated, and we got the logic for change adapter */}
      {isConnected && account ? (
        <>
          <p>Network: {networkInfo?.name}</p>
          <p>
            Native Balance: {nativeBalance} {networkInfo?.nativeSymbol}
          </p>
        </>
      ) : (
        <p className="text-muted-foreground">
          Connect your wallet to see details
        </p>
      )}
    </div>
  );
}
