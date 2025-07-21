import { useState, useEffect } from "react";

export function useTokenList(chainId: number) {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chainId) return;
    setLoading(true);
    fetch(`/api/tokens/list?chainId=${chainId}&page=1`)
      .then((res) => res.json())
      .then((data) => setTokens(data))
      .finally(() => setLoading(false));
  }, [chainId]);

  return { tokens, loading };
}
