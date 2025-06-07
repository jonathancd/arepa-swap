import { INetwork } from "../types/INetwork";

const networks: INetwork[] = [
  {
    id: 1,
    name: "Ethereum",
    chainIdHex: "0x1",
    icon: "/icons/networks/ethereum.svg",
  },
  {
    id: 11155111,
    name: "Sepolia",
    chainIdHex: "0xaa36a7",
    icon: "/icons/networks/sepolia.svg",
  },
  {
    id: 56,
    name: "BSC",
    chainIdHex: "0x38",
    icon: "/icons/networks/bsc.svg",
  },
  {
    id: 137,
    name: "Polygon",
    chainIdHex: "0x89",
    icon: "/icons/networks/polygon.svg",
  },
  {
    id: 101,
    name: "Solana",
    chainIdHex: "solana", // special case, not EVM-compatible
    icon: "/icons/networks/solana.svg",
  },
];

export const getSupportedNetworks = () => networks;
export const findNetworkByHex = (hex: string) =>
  networks.find((n) => n.chainIdHex === hex);
export const findNetworkById = (id: number) =>
  networks.find((n) => n.id === id);
