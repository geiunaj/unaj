import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const clase = searchParams.get("clase") ?? undefined;

    // Filtrar por clase si se proporciona
    const tiposFertilizante = await prisma.tipoFertilizante.findMany({
      where: {
        ...(clase && { clase: { contains: clase}}), 
      },
    });

    return NextResponse.json(tiposFertilizante);
  } catch (error) {
    console.error("Error finding tipos de fertilizante", error);
    return new NextResponse("Error finding tipos de fertilizante", { status: 500 });
  }
}
