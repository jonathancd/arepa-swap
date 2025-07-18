import { useEffect, useState } from "react";
import { IToken } from "../types/IToken";

export function useTokenPrice(token: IToken | null, protocol: string = "evm") {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    if (!token) return;

    const fetchPrice = async () => {
      try {
        const res = await fetch(
          `/api/tokens/price?address=${token.address}&chainId=${token.chainId}&protocol=${protocol}`
        );
        const data = await res.json();
        setPrice(data.usdPrice ?? null);
      } catch (e) {
        setPrice(null);
      }
    };

    fetchPrice();
  }, [token, protocol]);
  console.log("price");
  console.log({ price });
  return price;
}
