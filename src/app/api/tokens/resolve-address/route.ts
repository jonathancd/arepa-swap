import { NextRequest, NextResponse } from "next/server";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const chainId = searchParams.get("chainId");

  if (!symbol || !chainId) {
    return NextResponse.json(
      { error: "Missing symbol or chainId" },
      { status: 400 }
    );
  }

  // Inicializa Moralis si es necesario
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }

  try {
    // Usa EvmChain importado
    const chain = EvmChain.create(Number(chainId));
    const response = await Moralis.EvmApi.token.getTokenMetadataBySymbol({
      symbols: [symbol],
      chain,
    });
    const data = response.toJSON()[0];
    if (!data?.address) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }
    // Puedes enriquecer con más datos si quieres
    return NextResponse.json({
      symbol: data.symbol,
      name: data.name,
      address: data.address,
      decimals: parseInt(data.decimals ?? "18", 10),
      icon: data.logo || "",
      chainId: Number(chainId),
    });
  } catch (e) {
    console.error("Error resolving token address:", e);
    return NextResponse.json(
      { error: "Failed to resolve token address" },
      { status: 500 }
    );
  }
}
