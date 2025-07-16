"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTokenSearch } from "../hooks/useTokenSearch";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import Image from "next/image";
import { TokenRegistry } from "../registry/tokenRegistry";
import { IToken } from "../types/IToken";
import { EvmNetworkRegistry } from "@/features/protocols/evm/constants/evmNetworkRegistry";

interface TokenSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (token: IToken) => void;
}

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

export function TokenSelectorModal({
  open,
  onClose,
  onSelect,
}: TokenSelectorModalProps) {
  const isClient = useIsClient();
  const { selectedNetwork } = useNetworkStore();
  const defaultChainId = selectedNetwork?.id ?? 1;
  const [query, setQuery] = useState("");
  const [selectedChainId, setSelectedChainId] = useState(defaultChainId);

  const [debouncedQuery] = useDebounce(query, 500);

  const { tokens: searchedTokens, loading } = useTokenSearch(
    debouncedQuery,
    selectedChainId
  );
  const localTokens = TokenRegistry[selectedChainId] || [];
  const tokensToShow = query.length >= 2 ? searchedTokens : localTokens;

  const handleSelect = (token: IToken) => {
    onSelect(token);
    onClose();
  };

  if (!isClient) return <div />;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 space-y-4">
        <h2 className="text-lg font-semibold">Select a token</h2>

        <Input
          placeholder="Search token by name or symbol..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex gap-4 justify-center py-2 border-b border-border">
          {EvmNetworkRegistry.map((network) => (
            <button
              key={network.id}
              onClick={() => setSelectedChainId(network.id)}
              className={`w-[36px] h-[36px] rounded-full p-[2px] border-2 ${
                selectedChainId === network.id
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <Image
                src={network.icon}
                alt={network.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            </button>
          ))}
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {loading && (
            <p className="text-sm text-muted-foreground">Searching...</p>
          )}
          {!loading && tokensToShow.length === 0 && (
            <p className="text-sm text-muted-foreground">No tokens found</p>
          )}
          {!loading &&
            tokensToShow.map((token) => (
              <button
                key={token.address}
                onClick={() => handleSelect(token)}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  {token.icon?.startsWith("http") ||
                  token.icon?.startsWith("/") ? (
                    <Image
                      src={token.icon}
                      alt={token.symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-[24px] h-[24px] rounded-full bg-muted" />
                  )}
                  <div className="text-left">
                    <div className="font-medium">
                      {token.displaySymbol ?? token.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {token.name}
                    </div>
                  </div>
                </div>
                <div className="text-xs truncate max-w-[140px] text-right text-muted-foreground">
                  {token.address}
                </div>
              </button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
