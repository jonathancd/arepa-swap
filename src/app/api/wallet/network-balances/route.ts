import { NextRequest, NextResponse } from "next/server";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { initMoralis } from "@/lib/initMoralis";

function getEvmChainFromId(chainId: string | null): EvmChain | null {
  switch (chainId) {
    case "1":
      return EvmChain.ETHEREUM;
    case "56":
      return EvmChain.BSC;
    case "137":
      return EvmChain.POLYGON;
    default:
      return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const chainId = searchParams.get("chainId");

  if (!address || !chainId) {
    return NextResponse.json(
      { error: "Missing address or chainId" },
      { status: 400 }
    );
  }

  const chain = getEvmChainFromId(chainId);
  if (!chain) {
    return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });
  }

  try {
    await initMoralis();

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain,
    });

    const rawTokens = response.toJSON();

    const tokens = rawTokens
      .map((token: any) => {
        const balance =
          Number(token.balance) / Math.pow(10, token.decimals || 18);

        return {
          contract_address: token.token_address,
          contract_name: token.name,
          contract_ticker_symbol: token.symbol,
          logo_url: token.logo || "",
          balance,
        };
      })
      .filter((token) => token.balance > 0); // solo tokens con balance real

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error in GET /wallet/balances:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
