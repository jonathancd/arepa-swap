import { EvmChain } from "@moralisweb3/common-evm-utils";
import { IToken } from "@/features/token/types/IToken";

const baseIcon = "/icons/tokens";

/**
 * Why use WETH instead of ETH?
 *
 * Ethereum's native token ETH is not an ERC-20 token,
 * and therefore cannot interact directly with most DeFi protocols
 * (Uniswap, PancakeSwap, etc) which require standard interfaces.
 *
 * WETH ("Wrapped ETH") is an ERC-20 representation of ETH,
 * allowing it to be swapped, approved, and used in contracts
 * like any other token.
 *
 * In the UI, we display it as "ETH" to be user-friendly,
 * but internally, we use the actual WETH token address.
 */

export const TokenRegistry: Record<number, IToken[]> = {
  // -------- Ethereum (Chain ID 1) --------
  [EvmChain.ETHEREUM.decimal]: [
    {
      symbol: "WETH",
      displaySymbol: "ETH",
      name: "Ethereum",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
      // icon: `${baseIcon}/eth.png`,
      icon: "https://coin-images.coingecko.com/coins/images/279/thumb/ethereum.png",
      chainId: 1,
      isNative: true,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
      icon: `${baseIcon}/usdt.png`,
      chainId: 1,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      decimals: 6,
      icon: `${baseIcon}/usdc.png`,
      chainId: 1,
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      icon: `${baseIcon}/dai.png`,
      chainId: 1,
    },
    // {
    //   symbol: "LINK",
    //   name: "Chainlink",
    //   address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    //   decimals: 18,
    //   icon: `${baseIcon}/link.png`,
    //   chainId: 1,
    // },
    // {
    //   symbol: "UNI",
    //   name: "Uniswap",
    //   address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    //   decimals: 18,
    //   icon: `${baseIcon}/uni.png`,
    //   chainId: 1,
    // },
    // {
    //   symbol: "SHIB",
    //   name: "Shiba Inu",
    //   address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    //   decimals: 18,
    //   icon: `${baseIcon}/shib.png`,
    //   chainId: 1,
    // },
  ],

  // -------- BSC (Chain ID 56) --------
  [EvmChain.BSC.decimal]: [
    {
      symbol: "WBNB",
      displaySymbol: "BNB",
      name: "Binance Coin",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
      icon: `${baseIcon}/bnb.png`,
      chainId: 56,
      isNative: true,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x55d398326f99059fF775485246999027B3197955",
      decimals: 18,
      icon: `${baseIcon}/tether.png`,
      chainId: 56,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      decimals: 18,
      icon: `${baseIcon}/usdc.png`,
      chainId: 56,
    },
    {
      symbol: "CAKE",
      name: "PancakeSwap",
      address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
      decimals: 18,
      icon: `${baseIcon}/cake.png`,
      chainId: 56,
    },
    {
      symbol: "BTCB",
      name: "Bitcoin (Binance-Peg)",
      address: "0x7130d2a12b9bcBFAe4f2634d864A1Ee1Ce3Ead9c",
      decimals: 18,
      icon: `${baseIcon}/bitcoin.png`,
      chainId: 56,
    },
    {
      symbol: "ADA",
      name: "Cardano (Binance-Peg)",
      address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
      decimals: 18,
      icon: `${baseIcon}/cardano.png`,
      chainId: 56,
    },
  ],

  // -------- Arbitrum (Chain ID 42161) --------
  [EvmChain.ARBITRUM.decimal]: [
    {
      symbol: "WETH",
      displaySymbol: "ETH",
      name: "Ethereum (Arbitrum)",
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      decimals: 18,
      icon: `${baseIcon}/eth.png`,
      chainId: 42161,
      isNative: true,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      decimals: 6,
      icon: `${baseIcon}/usdt.png`,
      chainId: 42161,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xaf88d065e77c8C2239327C5EDb3A432268e5831",
      decimals: 6,
      icon: `${baseIcon}/usdc.png`,
      chainId: 42161,
    },
    {
      symbol: "ARB",
      name: "Arbitrum Token",
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      decimals: 18,
      icon: `${baseIcon}/arbitrum.png`,
      chainId: 42161,
    },
    {
      symbol: "GMX",
      name: "GMX",
      address: "0xfc5a1a6eb076a2c7a3a785e737d404fbf5c38a40",
      decimals: 18,
      icon: `${baseIcon}/gmx.png`,
      chainId: 42161,
    },
    {
      symbol: "MAGIC",
      name: "Treasure (MAGIC)",
      address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342",
      decimals: 18,
      icon: `${baseIcon}/magic.png`,
      chainId: 42161,
    },
  ],
};
