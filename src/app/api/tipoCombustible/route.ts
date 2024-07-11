import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const tiposCombustible = await prisma.tipoCombustible.findMany();
    return NextResponse.json(tiposCombustible);
  } catch (error) {
    console.error("Error finding tiposCombustible", error);
    return new NextResponse("Error finding tiposCombustible", { status: 500 });
  }
}
