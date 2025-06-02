// | Red              | Chain ID   | Propósito                             |
// | ---------------- | ---------- | ------------------------------------- |
// | Ethereum Mainnet | `1`        | Red principal, real, con ETH real     |
// | Sepolia          | `11155111` | Testnet oficial de Ethereum (2024+)   |
// | Goerli           | `5`        | Antigua testnet, en desuso            |
// | Polygon          | `137`      | L2 rápida y barata compatible con EVM |
// | Arbitrum         | `42161`    | L2 escalable basada en rollups        |
// | BSC              | `56`       | Binance Smart Chain                   |

import { TokenInfo } from "@/lib/types/token";

export const NETWORKS = {
  SEPOLIA: 11155111,
  MAINNET: 1,
  BSC: 56,
};

export const TOKENS_BY_CHAIN: Record<number, TokenInfo[]> = {
  [NETWORKS.SEPOLIA]: [
    {
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      symbol: "LINK",
      decimals: 18,
    },
    {
      address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
      symbol: "WETH",
      decimals: 18,
    },
    // {
    //   address: "0xBA...3682", // Reemplaza con la dirección completa de USDC en Sepolia
    //   symbol: "USDC",
    //   decimals: 6,
    // },
    // {
    //   address: "0x3E...91F4", // Reemplaza con la dirección completa de WBTC en Sepolia
    //   symbol: "WBTC",
    //   decimals: 8,
    // },
  ],
  [NETWORKS.MAINNET]: [
    {
      address: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      symbol: "USDC",
      decimals: 6,
    },
    {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      symbol: "DAI",
      decimals: 18,
    },
    {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      symbol: "WETH",
      decimals: 18,
    },
    {
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      symbol: "WBTC",
      decimals: 8,
    },
    {
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      symbol: "LINK",
      decimals: 18,
    },
  ],
  [NETWORKS.BSC]: [
    {
      address: "0x55d398326f99059ff775485246999027b3197955",
      symbol: "USDT",
      decimals: 18,
    },
    {
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      symbol: "ETH",
      decimals: 18,
    },
  ],
};
