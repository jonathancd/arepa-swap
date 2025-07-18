import { EvmChain } from "@moralisweb3/common-evm-utils";
import { IEvmNetwork } from "../types/IEvmNetwork";
import { Protocol } from "../../constants/Protocol";

const baseUrl = "/icons/chains";

export const EvmNetworkRegistry: IEvmNetwork[] = [
  {
    id: 1,
    name: "Ethereum",
    icon: `${baseUrl}/1.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0x1",
    evmChain: EvmChain.ETHEREUM,
    // rpcUrl: "https://rpc.ankr.com/eth",
    rpcUrl: "https://rpc.ankr.com/eth/" + process.env.NEXT_PUBLIC_RPC_ETHEREUM,
    routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2
    explorerUrl: "https://etherscan.io",
  },
  {
    id: 56,
    name: "BSC",
    icon: `${baseUrl}/56.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0x38",
    evmChain: EvmChain.BSC,
    rpcUrl: "https://bsc-dataseed.binance.org/",
    routerAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // PancakeSwap V2
    explorerUrl: "https://bscscan.com",
  },
  {
    id: 137,
    name: "Polygon",
    icon: `${baseUrl}/137.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0x89",
    evmChain: EvmChain.POLYGON,
    rpcUrl: "https://polygon-rpc.com",
    routerAddress: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", // QuickSwap
    explorerUrl: "https://polygonscan.com",
  },
  {
    id: 42161,
    name: "Arbitrum",
    icon: `${baseUrl}/42161.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0xa4b1",
    evmChain: EvmChain.ARBITRUM,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    // routerAddress: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506", // SushiSwap V2
    routerAddress: "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb", // PancakeSwap V2
    explorerUrl: "https://arbiscan.io",
  },
  {
    id: 10,
    name: "Optimism",
    icon: `${baseUrl}/10.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0xa",
    evmChain: EvmChain.OPTIMISM,
    rpcUrl: "https://mainnet.optimism.io",
    routerAddress: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", // Uniswap V3
    explorerUrl: "https://optimistic.etherscan.io",
  },
  {
    id: 43114,
    name: "Avalanche",
    icon: `${baseUrl}/43114.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0xa86a",
    evmChain: EvmChain.AVALANCHE,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    routerAddress: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4", // Trader Joe
    explorerUrl: "https://snowtrace.io",
  },
  {
    id: 8453,
    name: "Base",
    icon: `${baseUrl}/8453.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0x2105",
    evmChain: EvmChain.BASE,
    rpcUrl: "https://mainnet.base.org",
    routerAddress: "0x327Df1E6de05895d2ab08513aaDD9313Fe505d86", // Uniswap V3
    explorerUrl: "https://basescan.org",
  },
  // {
  //   id: 5,
  //   name: "Goerli (Testnet)",
  //   icon: `${baseUrl}/5.png`,
  //   protocol: Protocol.EVM,
  //   chainIdHex: "0x5",
  //   evmChain: EvmChain.GOERLI,
  //   rpcUrl: "https://rpc.ankr.com/eth_goerli",
  //   routerAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", // Uniswap V2 (testnet)
  //   explorerUrl: "https://goerli.etherscan.io",
  // },
  {
    id: 11155111,
    name: "Sepolia (Testnet)",
    icon: `${baseUrl}/11155111.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0xaa36a7",
    evmChain: EvmChain.SEPOLIA,
    rpcUrl: "https://rpc.sepolia.org",
    routerAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", // Uniswap V2 (testnet)
    explorerUrl: "https://sepolia.etherscan.io",
  },
];
