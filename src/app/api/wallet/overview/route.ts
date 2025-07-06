import { NextRequest, NextResponse } from "next/server";
import { BalanceServiceRegistry } from "@/features/protocols/services/BalanceServiceRegistry";
import { Protocol } from "@/features/protocols/constants/Protocol";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const addressParam = searchParams.get("address");
  const protocolParam = searchParams.get("protocol");

  if (!addressParam || !protocolParam) {
    return NextResponse.json(
      { error: "Missing address or protocol" },
      { status: 400 }
    );
  }

  const protocol = protocolParam.toLowerCase() as Protocol;

  if (!Object.values(Protocol).includes(protocol)) {
    return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
  }

  try {
    const service = BalanceServiceRegistry.get(protocol);
    const overview = await service.getOverview(addressParam);

    return NextResponse.json(overview);
  } catch (error) {
    console.error("❌ Error in wallet overview API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
