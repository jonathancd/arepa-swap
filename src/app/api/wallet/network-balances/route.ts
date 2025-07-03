import { NextRequest, NextResponse } from "next/server";
import { BalanceServiceRegistry } from "@/features/protocols/services/BalanceServiceRegistry";
import { Protocol } from "@/features/protocols/constants/Protocol";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const protocol = (searchParams.get("protocol") as Protocol) ?? Protocol.EVM;

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    const balanceService = BalanceServiceRegistry.get(protocol);
    const tokens = await balanceService.getWalletBalances(address);

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error fetching balances:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
