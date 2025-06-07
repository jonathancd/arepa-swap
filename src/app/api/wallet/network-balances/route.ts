import { NextRequest, NextResponse } from "next/server";
import { initMoralis } from "@/lib/initMoralis";
import {
  normalizeToken,
  isSuspiciousToken,
} from "@/features/token/adapters/tokenAdapter";
import {
  getChainNameById,
  getEvmChainById,
} from "@/features/network/utils/chainUtils";
import Moralis from "moralis";

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

  const chain = getEvmChainById(chainId);
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
    const network = getChainNameById(chainId);

    const tokens = rawTokens
      .map((token) => normalizeToken(token, network))
      .filter((token) => token.balance > 0 && !isSuspiciousToken(token));

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error in GET /wallet/balances:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
