"use client";

import { useConnectorManager } from "@/features/wallet/hooks/useConnectorManager";

const chains = [
  {
    id: 1,
    name: "Ethereum",
  },
  {
    id: 56,
    name: "BSC",
  },
];

export function ChainSelector() {
  const { selectedChainId, setSelectedChainId } = useConnectorManager();

  return (
    <select
      value={selectedChainId}
      onChange={(e) => setSelectedChainId(Number(e.target.value))}
    >
      {chains.map((chain) => (
        <option key={chain.id} value={chain.id}>
          {chain.name}
        </option>
      ))}
    </select>
  );
}
