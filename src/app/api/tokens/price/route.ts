import { NextRequest, NextResponse } from "next/server";
import { BalanceServiceRegistry } from "@/features/protocols/services/BalanceServiceRegistry";
import { Protocol } from "@/features/protocols/constants/Protocol";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const chainId = searchParams.get("chainId");
  const protocolParam = searchParams.get("protocol");

  if (!address || !chainId || !protocolParam) {
    return NextResponse.json(
      { error: "Missing address, chainId or protocol" },
      { status: 400 }
    );
  }

  const protocol = protocolParam.toLowerCase() as Protocol;

  if (!Object.values(Protocol).includes(protocol)) {
    return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
  }

  try {
    const service = BalanceServiceRegistry.get(protocol);
    const usdPrice = await service.getTokenPrice(address, chainId);
    return NextResponse.json({ usdPrice });
  } catch (error) {
    console.error("Error in /api/tokens/price:", error);
    return NextResponse.json(
      { error: "Failed to fetch token price" },
      { status: 500 }
    );
  }
}
