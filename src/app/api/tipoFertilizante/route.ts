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

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { nombre, porcentajeNitrogeno, unidad, clase } = body;
    if (
      !nombre ||
      !porcentajeNitrogeno ||
      !unidad ||
      !clase
    ) {
      return new NextResponse("Missing or invalid required fields", { status: 400 });
    }

    const tipoFertilizante = await prisma.tipoFertilizante.create({
      data: {
        nombre,
        porcentajeNitrogeno,
        unidad,
        clase,
      },
    });

    
    return NextResponse.json({
      message: "Tipo de Fertilizante creado",
      tipoFertilizante: tipoFertilizante,
  });

  } catch (error) {
    console.error("Error creating tipo de fertilizante", error);
    return new NextResponse("Error creating tipo de fertilizante", { status: 500 });
  }
}