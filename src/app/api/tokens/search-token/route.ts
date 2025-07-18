import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chain = "eth", query = "" } = req.query;

  if (typeof query !== "string" || query.length < 2) {
    return res.status(400).json({ error: "Invalid query" });
  }

  try {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/search?chain=${chain}&q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "X-API-Key": process.env.MORALIS_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Moralis error: ${response.status}`);
    }

    const result = await response.json();

    const tokens = result.map((token: any) => ({
      symbol: token.symbol ?? "",
      name: token.name ?? "",
      address: token.token_address?.toLowerCase() ?? "",
      decimals: token.decimals ?? 18,
      icon: "", // podriamos agregar fetch al logo más adelante
      chainId: parseInt(chain.toString()),
    }));

    return res.status(200).json(tokens);
  } catch (error) {
    console.error("Error in /api/search-token:", error);
    return res.status(500).json({ error: "Failed to search tokens" });
  }
}
