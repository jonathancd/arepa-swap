"use client";

import { useEffect } from "react";
import { useWalletStore } from "../stores/walletStore";
import { fetchTokenBalances } from "../utils/fetchWalletBalances";

export default function WalletBalances() {
  const { account, tokenBalances, totalBalanceUSD } = useWalletStore();

  useEffect(() => {
    if (account) {
      fetchTokenBalances(account);
    }
  }, [account]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Balance total: ${totalBalanceUSD.toFixed(2)}
      </h2>
      <ul>
        {tokenBalances.map((token) => (
          <li key={token.contract_address} className="flex items-center mb-2">
            <img
              src={token.logo_url}
              alt={token.contract_ticker_symbol}
              className="w-6 h-6 mr-2"
            />
            <span className="mr-2">
              {token.contract_name} ({token.contract_ticker_symbol}):
            </span>
            <span>
              {token.balance.toFixed(4)} - ${token.quote.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
