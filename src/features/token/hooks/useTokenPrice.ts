import { useEffect, useState } from "react";
import { IToken } from "../types/IToken";

export function useTokenPrice(token: IToken | null, protocol: string = "evm") {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    // Solo hacer fetch si tenemos un token válido con address
    if (!token?.address || !token?.chainId) {
      setPrice(null);
      return;
    }

    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `/api/tokens/price?address=${token.address}&chainId=${token.chainId}&protocol=${protocol}`
        );

        if (!res.ok) {
          console.warn(
            `[useTokenPrice] API error for ${token.symbol}:`,
            res.status
          );
          setPrice(null);
          return;
        }

        const data = await res.json();
        setPrice(data.usdPrice ?? null);
      } catch (e) {
        console.warn(`[useTokenPrice] Fetch error for ${token.symbol}:`, e);
        setPrice(null);
      }
    };

    fetchPrice();
  }, [token?.address, token?.chainId, protocol]);

  return price;
}
