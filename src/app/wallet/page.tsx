"use client";

import { useConnectorManager } from "@/features/wallet/hooks/useConnectorManager";
import { useNativeBalance } from "@/features/wallet/hooks/useNativeBalance";

// import { TokenList, WalletInfo, NetworkStatus } from "@/features/dashboard";

export default function WalletPage() {
  const { account, chainAdapter, isConnected } = useConnectorManager();
  const nativeBalance = useNativeBalance(account, chainAdapter, isConnected);

  return (
    <div className="p-4 space-y-4">
      {/* <WalletInfo />
      <NetworkStatus />
      <TokenList /> */}
      <h1 className="text-xl font-bold">Wallet Dashboard</h1>

      <p>Account: {account ?? "Not connected"}</p>
      <p>Red: {chainAdapter?.name ?? "Not selected"}</p>
      <p>
        Native Balance: {nativeBalance || "-"}{" "}
        {chainAdapter?.nativeSymbol ?? ""}
      </p>
    </div>
  );
}
