import { useEffect, useState } from "react";
import { ethers, formatUnits } from "ethers";
import { TokenInfo } from "@/lib/types/token";
import { TOKENS_BY_CHAIN } from "@/lib/constants/networks";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

interface TokenBalance {
  symbol: string;
  balance: string;
}

export function useTokenBalances(address: string, chainId: number | null) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);

  useEffect(() => {
    if (
      !address ||
      !chainId ||
      typeof window === "undefined" ||
      !window.ethereum
    )
      return;

    const tokens: TokenInfo[] = TOKENS_BY_CHAIN[chainId] || [];
    const provider = new ethers.BrowserProvider(window.ethereum);

    const fetchBalances = async () => {
      const results: TokenBalance[] = [];

      for (const token of tokens) {
        const contract = new ethers.Contract(
          token.address,
          ERC20_ABI,
          provider
        );
        const rawBalance = await contract.balanceOf(address);
        if (rawBalance > 0n) {
          const formattedBalance = formatUnits(rawBalance, token.decimals);
          results.push({ symbol: token.symbol, balance: formattedBalance });
        }
      }

      setBalances(results);
    };

    fetchBalances();
  }, [address, chainId]);

  return balances;
}
