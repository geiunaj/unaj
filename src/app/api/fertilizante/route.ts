import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta sea correcta
import { formaFertilizante } from "@/lib/resources/fertilizanteResource";
import { Fertilizante } from "@prisma/client";
import { FertilizanteRequest } from "@/components/fertilizantes/services/fertilizante.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo") ?? undefined;
    const sedeId = searchParams.get("sedeId") ?? undefined;
    const sort = searchParams.get("sort") ?? "id";
    const direction = searchParams.get("direction") ?? "desc";

    const fertilizantes = await prisma.fertilizante.findMany({
      where: {
        sede_id: sedeId ? parseInt(sedeId) : undefined,
      },
      include: {
        anio: true,
        sede: true,
        tipoFertilizante: true,
      },
      orderBy: {
        [sort]: direction,
      },
    });

    const formattedFertilizantes: Fertilizante[] = fertilizantes.map(formaFertilizante);

    return NextResponse.json(formattedFertilizantes);
  } catch (error) {
    console.error("Error finding fertilizantes", error);
    return NextResponse.json({ message: "Error finding fertilizantes" }, { status: 500 });
  }
}
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: FertilizanteRequest = await req.json();
    const fertilizante = await prisma.fertilizante.create({
      data: {
        tipoFertilizante_id: body.tipoFertilizante_id,
        //cantidad debe ser numero
        cantidad: body.cantidad,
        sede_id: body.sede_id,
        anio_id: body.anio_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(fertilizante);
  } catch (error) {
    console.error("Error creating fertilizante", error);
    return NextResponse.json({ message: "Error creating fertilizante" }, { status: 500 });
  }
}