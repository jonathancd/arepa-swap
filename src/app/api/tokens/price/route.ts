import { NextRequest, NextResponse } from "next/server";
import { initMoralis } from "@/lib/initMoralis";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

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

  try {
    await initMoralis();
    const chain = EvmChain.create(Number(chainId));
    const res = await Moralis.EvmApi.token.getTokenPrice({ address, chain });
    const usdPrice = res.toJSON().usdPrice || 0;
    return NextResponse.json({ usdPrice });
  } catch (error) {
    console.error("Error in /api/tokens/price:", error);
    return NextResponse.json(
      { error: "Failed to fetch token price" },
      { status: 500 }
    );
  }
}
