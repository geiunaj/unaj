import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const tiposFertilizante = await prisma.tipoFertilizante.findMany();
    return NextResponse.json(tiposFertilizante);
  } catch (error) {
    console.error("Error finding tipos fertilizates", error);
    return new NextResponse("Error finding tiposFertilizante", { status: 500 });
  }
}
