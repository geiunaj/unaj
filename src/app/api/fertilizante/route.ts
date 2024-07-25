import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta sea correcta
import { formaFertilizante } from "@/lib/resources/fertilizanteResource";
import { Fertilizante } from "@prisma/client";
import { FertilizanteRequest } from "@/components/fertilizantes/services/fertilizante.interface";

// GET ROUTE -> SIN PARAMETROS
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const sedeId = searchParams.get("sedeId") ?? undefined;
    const sort = searchParams.get("sort") ?? "id";
    const direction = searchParams.get("direction") ?? "desc";
    const anio = searchParams.get("anioId") ?? undefined;
    const tipoFertilizanteId = searchParams.get("tipoFertilizanteId") ?? undefined;
    const claseFertilizante = searchParams.get("claseFertilizante") ?? undefined;

    let anioId: number | undefined;
    if (anio) {
      const anioRecord = await prisma.anio.findFirst({
        where: { nombre: anio },
      });
      anioId = anioRecord ? anioRecord.id : undefined;
    }

    const fertilizantes = await prisma.fertilizante.findMany({
      where: {
        sede_id: sedeId ? parseInt(sedeId) : undefined,
        anio_id: anioId,
        tipoFertilizante_id: tipoFertilizanteId
          ? parseInt(tipoFertilizanteId)
          : undefined,
        tipoFertilizante: {
          clase: claseFertilizante ? claseFertilizante : undefined,
        },
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

    const formattedFertilizantes: Fertilizante[] = fertilizantes.map(
      (fertilizante) => formaFertilizante(fertilizante)
    );

    return NextResponse.json(formattedFertilizantes);
  } catch (error) {
    console.error("Error al buscar los fertilizantes", error);
    return new NextResponse("Error al buscar los fertilizantes", {
      status: 500,
    });
  }
}

// POST ROUTE -> SIN PARAMETROS
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: FertilizanteRequest = await req.json();

    // Validar campos requeridos
    if (
      typeof body.tipoFertilizante_id !== "number" ||
      typeof body.cantidad !== "number" ||
      typeof body.sede_id !== "number" ||
      typeof body.anio_id !== "number"
    ) {
      return new NextResponse("Campos requeridos faltantes o inválidos", {
        status: 400,
      });
    }

    const fertilizante = await prisma.fertilizante.create({
      data: {
        tipoFertilizante_id: body.tipoFertilizante_id,
        cantidad: body.cantidad,
        sede_id: body.sede_id,
        anio_id: body.anio_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        anio: true,
        sede: true,
        tipoFertilizante: true,
      },
    });

    const formattedFertilizantes = formaFertilizante(fertilizante);

    return NextResponse.json(formattedFertilizantes);
  } catch (error) {
    console.error("Error al crear el fertilizante", error);
    return new NextResponse("Error al crear el fertilizante", { status: 500 });
  }
}
