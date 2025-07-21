import { motion } from "framer-motion";
import Image from "next/image";
import { ITokenSelectorProps as Props } from "../../types/ITokenSelector";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, XIcon } from "lucide-react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { useAvailableNetworks } from "@/features/network/hooks/useAvailableNetworks";
import { useSwapStore } from "@/features/swap/stores/swapStore";
import { useEffect, useMemo, useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import { useTokenSearch } from "../../hooks/useTokenSearch";
import { TokenRegistry } from "../../registry/tokenRegistry";
import { IToken } from "../../types/IToken";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/formatters/formatNumber";
import { getDefaultTokensForNetwork } from "../../utils/getDefaultTokens";
import { resolveTokenAddress } from "../../services/resolveTokenAddress";
import { useTokenList } from "../../hooks/useTokenList";

export function TokenSelectorLayout({
  open,
  isConnected,
  isMobile,
  editingField,
  currentFromToken,
  currentToToken,
  onSelect,
  onClose,
  onSwapTokens,
}: Props) {
  const { overviewTokenBalances } = useWalletStore();
  const availableNetworks = useAvailableNetworks();
  const { swapMode, setFromToken, setToToken } = useSwapStore();
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();

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

  // Decide qué tokens mostrar
  let tokensToShow: IToken[] = [];
  if (query.length >= 2) {
    tokensToShow = searchedTokens;
    // Si el modo es ethers o 1inch, filtra los resultados por la red activa
    if (swapMode !== "lifi") {
      tokensToShow = tokensToShow.filter((t) => t.chainId === selectedChainId);
    }
  } else {
    tokensToShow = combinedTokens;
  }

  // Estado para loading de selección remota
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const handleSelect = async (token: IToken) => {
    setResolveError(null);
    if (token.address) {
      if (
        (editingField === "in" && currentToToken?.address === token.address) ||
        (editingField === "out" && currentFromToken?.address === token.address)
      ) {
        onSwapTokens();
      } else {
        onSelect(token);
      }
      onClose();
      return;
    }
    setResolving(true);
    try {
      const tokenWithAddress = await resolveTokenAddress(
        token.symbol,
        selectedChainId
      );
      onSelect(tokenWithAddress);
      onClose();
    } catch (e) {
      setResolveError(
        "No se pudo obtener la dirección del token. Intenta de nuevo."
      );
    } finally {
      setResolving(false);
    }
  };

  // 1. Evita peticiones dobles al abrir el modal
  useEffect(() => {
    if (open && selectedNetwork?.id && selectedNetwork.id !== selectedChainId) {
      setSelectedChainId(selectedNetwork.id);
    }
  }, [open, selectedNetwork, selectedChainId]);

  const orderedNetworks = useMemo(() => {
    const others = availableNetworks.filter((n) => n.id !== selectedChainId);
    const selected = availableNetworks.find((n) => n.id === selectedChainId);
    return selected ? [selected, ...others] : availableNetworks;
  }, [availableNetworks, selectedChainId]);

  // Decide si mostrar el selector de red
  const showNetworkSelector = swapMode === "lifi";

  // Hook para tokens de CoinGecko (solo primera página)
  const { tokens: tokensFromApi, loading: loadingApi } =
    useTokenList(selectedChainId);

  // Top tokens: todos los del registry
  const topTokens = TokenRegistry[selectedChainId] || [];

  // Token nativo (el que tiene isNative: true)
  const nativeToken = topTokens.find((t) => t.isNative);

  // Evitar duplicados: tokens ya mostrados en topTokens y wallet
  const topAddresses = new Set(topTokens.map((t) => t.address?.toLowerCase()));
  const walletAddresses = new Set(
    walletTokens.map((t) => t.contract_address?.toLowerCase())
  );
  const nativeAddress = nativeToken?.address?.toLowerCase();

  // 2. Mejora la búsqueda: filtra tokens de CoinGecko ya cargados
  const filteredTokensFromApi = useMemo(() => {
    if (!query) return tokensFromApi;
    return tokensFromApi.filter(
      (t) =>
        t.symbol.toLowerCase().includes(query.toLowerCase()) ||
        t.name?.toLowerCase().includes(query.toLowerCase())
    );
  }, [tokensFromApi, query]);

  // Listado principal: nativo primero, luego wallet tokens (sin duplicar nativo), luego tokens de CoinGecko (sin duplicar los anteriores)
  console.log({ nativeToken });
  console.log({ walletTokens });
  console.log({ tokensFromApi });

  // 3. Ajusta el filtro de filteredTokensToShow
  const filteredTokensToShow = [
    ...(nativeToken ? [nativeToken] : []),
    ...walletTokens.filter(
      (t) =>
        nativeAddress && t.contract_address?.toLowerCase() !== nativeAddress
    ),
    ...filteredTokensFromApi.filter((t) => {
      // Permite tokens sin address (nativos), pero evita duplicados
      const addr = t.address?.toLowerCase() || "";
      if (nativeAddress && addr === nativeAddress) return false;
      if (topAddresses.has(addr)) return false;
      if (walletAddresses.has(addr)) return false;
      // Si no tiene address, solo mostrar si no es el nativo
      if (!t.address && nativeToken && t.symbol === nativeToken.symbol)
        return false;
      return true;
    }),
  ];

  // Función para saber si un token está activo
  const isActive = (token: IToken) => {
    console.log({ token });
    if (!token) return false;
    if (editingField === "in") {
      return token.address
        ? token.address.toLowerCase() ===
            currentFromToken?.address?.toLowerCase()
        : token.symbol === currentFromToken?.symbol;
    } else if (editingField === "out") {
      return token.address
        ? token.address.toLowerCase() === currentToToken?.address?.toLowerCase()
        : token.symbol.toLowerCase() === currentToToken?.symbol.toLowerCase();
    }
    return false;
  };

  return (
    <motion.div
      initial={{ y: isMobile ? "100%" : "0%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: isMobile ? "100%" : "0%", opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 min-h-0 w-full flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-background rounded">
        <DialogTitle className="text-lg font-semibold">
          Select a Token
        </DialogTitle>

        <DialogDescription className="sr-only">
          Select a token for the swap.
        </DialogDescription>

        <DialogClose asChild>
          <button
            className="text-muted-foreground hover:opacity-[0.6]"
            aria-label="Close"
            autoFocus
          >
            <XIcon className="h-5 w-5" />
          </button>
        </DialogClose>
      </div>

      {showNetworkSelector && (
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
      )}

      <div className="flex flex-col flex-1 min-h-0 bg-surface">
        <div className="p-4">
          <Input
            className={`bg-background border-none rounded focus:ring-2 focus:ring-primary focus:ring-offset-0`}
            placeholder="Search token by name or symbol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Top tokens chips */}
        {topTokens.length > 0 && (
          <div className="px-4 my-3">
            <div className="mb-1 text-xs font-semibold text-muted-foreground">
              Top tokens
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {topTokens.map((token) => (
                <button
                  key={token.address || token.symbol}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-150
                  ${
                    isActive(token)
                      ? "bg-primary text-black border-primary"
                      : "bg-background !text-white border-border text-foreground opacity-80 hover:opacity-100"
                  }
                `}
                  onClick={() => handleSelect(token)}
                  disabled={resolving}
                >
                  {token.icon?.startsWith("http") ||
                  token.icon?.startsWith("/") ? (
                    <Image
                      src={token.icon}
                      alt={token.symbol}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-[20px] h-[20px] rounded-full bg-muted" />
                  )}
                  <span>{token.displaySymbol ?? token.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/*  */}
        <div className="bg-green flex flex-col flex-1 min-h-0 max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
          {loading && (
            <p className="text-sm text-muted-foreground">Searching...</p>
          )}
          {resolving && (
            <p className="text-sm text-primary">
              Resolviendo dirección del token...
            </p>
          )}
          {resolveError && (
            <p className="text-sm text-red-500">{resolveError}</p>
          )}
          {!loading && !resolving && filteredTokensToShow.length === 0 && (
            <p className="text-sm text-muted-foreground">No tokens found</p>
          )}
          {/* Renderizado original del listado de tokens, pero usando filteredTokensToShow */}
          {!loading &&
            !resolving &&
            filteredTokensToShow.map((token) => {
              // Busca si el token está en la wallet para mostrar balance y quote
              const walletTokenData = walletTokens.find(
                (t) =>
                  t.contract_address.toLowerCase() ===
                  token.address?.toLowerCase()
              );
              return (
                <button
                  key={token.symbol + (token.address || "noaddr")}
                  onClick={() =>
                    !isActive(token) ? handleSelect(token) : () => null
                  }
                  className={`group w-full flex items-center justify-between pl-4 py-2 m-0 hover:bg-[var(--background)] hover:opacity-[0.6] ${
                    isActive(token) ? "!cursor-default opacity-[0.6]" : ""
                  }`}
                  disabled={resolving}
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
                        {token.displaySymbol?.toUpperCase() ??
                          token.symbol?.toUpperCase()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pr-4 min-w-[70px]">
                    {isConnected ? (
                      <>
                        <div className="font-semibold text-sm text-[var(--drawer-title)] truncate">
                          {walletTokenData
                            ? formatNumber(walletTokenData.balance, {
                                decimals: 4,
                              })
                            : "0"}
                        </div>
                        <div className="text-xs text-[var(--drawer-subtitle)]">
                          {walletTokenData && walletTokenData.quote && (
                            <span>${walletTokenData.quote.toFixed(2)}</span>
                          )}
                        </div>
                      </>
                    ) : !isActive(token) ? (
                      <div className="hidden group-hover:inline-flex">
                        <ArrowRight />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
}
