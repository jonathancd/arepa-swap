import { useEffect, useMemo, useState } from "react";
import { searchTokenExternally } from "../services/searchTokenExternally";
import { IToken } from "../types/IToken";
import { TokenRegistry } from "../registry/tokenRegistry";

interface UseTokenSearchResult {
  tokens: IToken[];
  loading: boolean;
  error: string | null;
}

// Declaración de propiedad estática en el namespace del hook
export function useTokenSearch(
  query: string,
  chainId: number
): UseTokenSearchResult {
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializa cache solo una vez
  useTokenSearch.cache = useTokenSearch.cache ?? new Map<string, IToken[]>();
  const staticCache = useTokenSearch.cache;

  const localTokens = useMemo(() => TokenRegistry[chainId] || [], [chainId]);

  const localMatches = useMemo(() => {
    if (!query || query.length < 2) return [];
    return localTokens.filter(
      (token) =>
        // token.address.toLowerCase().includes(query.toLowerCase()) ||
        token.symbol.toLowerCase().includes(query.toLowerCase()) ||
        token.name?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, localTokens]);

  useEffect(() => {
    if (!query || query.length < 2 || !chainId) {
      setTokens([]);
      return;
    }

    const key = `${chainId}:${query.toLowerCase()}`;

    // Mostrar resultados locales al instante
    if (localMatches.length > 0) {
      setTokens(localMatches);
    }

    const fetchRemote = async () => {
      setLoading(true);
      setError(null);

      if (staticCache.has(key)) {
        setTokens(staticCache.get(key)!);
        setLoading(false);
        return;
      }

      try {
        const remoteTokens = await searchTokenExternally(query, chainId);
        const all = [...localMatches, ...remoteTokens].filter(
          (token, i, self) =>
            self.findIndex(
              (t) => t.address.toLowerCase() === token.address.toLowerCase()
            ) === i
        );

        staticCache.set(key, all);
        setTokens(all);
      } catch (err) {
        console.error("Token search failed", err);
        setError("Failed to search tokens");
      } finally {
        setLoading(false);
      }
    };

    fetchRemote();
  }, [query, chainId, localMatches, staticCache]);

  return { tokens, loading, error };
}

// 🧠 Agrega el namespace para cachear en memoria
export namespace useTokenSearch {
  export let cache: Map<string, IToken[]>;
}
