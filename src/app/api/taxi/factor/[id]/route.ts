import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatTaxiFactor } from "@/lib/resources/taxiFactor.resource";
import { TaxiFactorRequest } from "@/components/taxiFactor/services/TaxiFactor.interface";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    const TaxiFactor = await prisma.factorEmisionTaxi.findUnique({
      where: {
        id: id,
      },
      include: {
        anio: true,
      },
    });

    if (!TaxiFactor) {
      return new NextResponse("Factor de Taxi no encontrado", { status: 404 });
    }

    return NextResponse.json(formatTaxiFactor(TaxiFactor));
  } catch (error) {
    console.error("Error buscando Factor de Taxi", error);
    return new NextResponse("Error buscando Factor de Taxi", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("ID inválido", { status: 400 });
    }

    const body: TaxiFactorRequest = await req.json();
    const TaxiFactorRequest = {
      factor: body.factor,
      anio_id: body.anioId,
      fuente: body.fuente,
      link: body.link,
    };

    const TaxiFactor = await prisma.factorEmisionTaxi.update({
      where: {
        id: id,
      },
      data: TaxiFactorRequest,
      include: {
        anio: true,
      },
    });

    return NextResponse.json({
      message: "Factor de Taxi actualizado correctamente",
      TaxiFactor: formatTaxiFactor(TaxiFactor),
    });
  } catch (error) {
    console.error("Error actualizando Factor de Taxi", error);
    return new NextResponse("Error actualizando Factor de Taxi", {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("ID inválido", { status: 400 });
    }

    await prisma.factorEmisionTaxi.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Factor de Taxi eliminado correctamente",
    });
  } catch (error: any) {
    console.error("Error eliminando Factor de Taxi", error);
    return new NextResponse("Error eliminando Factor de Taxi", { status: 500 });
  }
}
