import { useEffect, useState } from "react";
import { IToken } from "../types/IToken";
import { getTokenPriceInUsd } from "../services/getTokenPriceInUsd";

export function useTokenPrice(token: IToken | null) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchPrice = async () => {
      const fetchedPrice = await getTokenPriceInUsd(token);
      setPrice(fetchedPrice);
    };

    fetchPrice();
  }, [token]);

  return price;
}
