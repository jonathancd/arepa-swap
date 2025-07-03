import { NextRequest, NextResponse } from "next/server";
import { initMoralis } from "@/lib/initMoralis";
import {
  normalizeToken,
  isSuspiciousToken,
} from "@/features/token/adapters/tokenAdapter";
import { findEvmNetworkById } from "@/features/protocols/evm/utils/evmNetworkUtils";
import Moralis from "moralis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const addressParam = searchParams.get("address");
  const chainIdParam = searchParams.get("chainId");

  if (!addressParam || !chainIdParam) {
    return NextResponse.json(
      { error: "Missing address or chainId" },
      { status: 400 }
    );
  }

  const chainId = Number(chainIdParam);

  if (Number.isNaN(chainId)) {
    return NextResponse.json({ error: "Invalid chainId" }, { status: 400 });
  }

  const chain = findEvmNetworkById(chainId);
  if (!chain) {
    return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });
  }

  try {
    await initMoralis();

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address: addressParam,
      chain: chainIdParam,
    });

    const rawTokens = response.toJSON();

    const tokens = rawTokens
      .map((token) => normalizeToken(token, chain.name))
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
