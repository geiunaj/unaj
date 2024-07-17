import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const tiposPapel = await prisma.tipoPapel.findMany();

    return NextResponse.json(tiposPapel);
  } catch (error) {
    console.error("Error al cargar los tipos de Papel", error);
    return new NextResponse("Error finding tipos de Papel", { status: 500 });
  }
}
