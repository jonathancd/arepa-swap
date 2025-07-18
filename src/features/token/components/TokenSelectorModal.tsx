"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTokenSearch } from "../hooks/useTokenSearch";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { useAvailableNetworks } from "@/features/network/hooks/useAvailableNetworks";
import Image from "next/image";
import { TokenRegistry } from "../registry/tokenRegistry";
import { IToken } from "../types/IToken";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { formatNumber } from "@/lib/formatters/formatNumber";

interface TokenSelectorModalProps {
  open: boolean;
  editingField: "in" | "out" | null;
  currentFromToken: IToken | null;
  currentToToken: IToken | null;
  onClose: () => void;
  onSelect: (token: IToken) => void;
  onSwapTokens: () => void;
}

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

export function TokenSelectorModal({
  open,
  editingField,
  currentFromToken,
  currentToToken,
  onClose,
  onSelect,
  onSwapTokens,
}: TokenSelectorModalProps) {
  const isClient = useIsClient();
  const { overviewTokenBalances } = useWalletStore();
  const { selectedNetwork } = useNetworkStore();
  const availableNetworks = useAvailableNetworks();

  const defaultChainId = selectedNetwork?.id ?? availableNetworks[0]?.id ?? 1;

  const [query, setQuery] = useState("");
  const [selectedChainId, setSelectedChainId] = useState(defaultChainId);
  const [debouncedQuery] = useDebounce(query, 500);

  const { tokens: searchedTokens, loading } = useTokenSearch(
    debouncedQuery,
    selectedChainId
  );

  // Filtra balances de la red activa (por nombre, como en overview)
  const networkName = availableNetworks.find(
    (n) => n.id === selectedChainId
  )?.name;
  const walletTokens = useMemo(() => {
    return overviewTokenBalances
      .filter(
        (t) =>
          t.network === networkName && t.balance > 0 && t.quote && t.quote > 0
      )
      .sort((a, b) => (b.quote ?? 0) - (a.quote ?? 0));
  }, [overviewTokenBalances, networkName]);

  // Mapear a IToken para mostrar en el modal (puedes ajustar según tus props)
  const walletTokensMapped: IToken[] = walletTokens.map((t) => ({
    symbol: t.contract_ticker_symbol,
    displaySymbol: t.contract_ticker_symbol,
    name: t.contract_name,
    address: t.contract_address,
    decimals: 18, // Ajusta si tienes info de decimales
    icon: t.logo_url,
    chainId: selectedChainId,
  }));

  // Combina tokens de la wallet y tokens populares (sin duplicar)
  const localTokens = TokenRegistry[selectedChainId] || [];
  const localTokensFiltered = localTokens.filter(
    (lt) =>
      !walletTokensMapped.some(
        (wt) => wt.address.toLowerCase() === lt.address.toLowerCase()
      )
  );
  const combinedTokens = [...walletTokensMapped, ...localTokensFiltered];

  const tokensToShow = query.length >= 2 ? searchedTokens : combinedTokens;

  const handleSelect = (token: IToken) => {
    if (
      (editingField === "in" && currentToToken?.address === token.address) ||
      (editingField === "out" && currentFromToken?.address === token.address)
    ) {
      onSwapTokens();
    } else {
      onSelect(token);
    }
    onClose();
  };

  useEffect(() => {
    if (open && selectedNetwork?.id) {
      setSelectedChainId(selectedNetwork.id);
    }
  }, [open, selectedNetwork]);

  const orderedNetworks = useMemo(() => {
    const others = availableNetworks.filter((n) => n.id !== selectedChainId);
    const selected = availableNetworks.find((n) => n.id === selectedChainId);
    return selected ? [selected, ...others] : availableNetworks;
  }, [availableNetworks, selectedChainId]);

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
          {orderedNetworks.map((network) => (
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
            tokensToShow.map((token) => {
              // Busca si el token está en la wallet para mostrar balance y quote
              const walletTokenData = walletTokens.find(
                (t) =>
                  t.contract_address.toLowerCase() ===
                  token.address.toLowerCase()
              );
              return (
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
                  <div className="text-right min-w-[70px]">
                    <div className="font-semibold text-sm text-[var(--drawer-title)] truncate">
                      {walletTokenData
                        ? formatNumber(walletTokenData.balance, { decimals: 4 })
                        : "0"}
                    </div>
                    <div className="text-xs text-[var(--drawer-subtitle)]">
                      {walletTokenData && walletTokenData.quote && (
                        <span>${walletTokenData.quote.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
