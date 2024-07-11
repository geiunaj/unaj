import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta sea correcta
import { formatCombustible } from "@/lib/resources/combustionResource";
import { Combustible } from "@prisma/client";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo") ?? "";
    const sedeId = searchParams.get("sedeId") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;
    const direction = searchParams.get("direction") ?? undefined;

    const combustibles = await prisma.combustible.findMany({
      where: {
        tipo: tipo,
        sede_id: sedeId ? parseInt(sedeId) : undefined,
      },
      include: {
        tipoCombustible: true,
        mes: true,
        anio: true,
        sede: true,
      },
      orderBy: {
        [sort ?? "id"]: direction ?? "asc",
      },
    });

    const formattedCombustibles: Combustible[] = [];

    for (const combustible of combustibles) {
      formattedCombustibles.push(formatCombustible(combustible));
    }

    return NextResponse.json(formattedCombustibles);
  } catch (error) {
    console.error("Error finding combustibles", error);
    return new NextResponse("Error finding combustibles", { status: 500 });
  }
}
