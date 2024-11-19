import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatTipoActivoFactor } from "@/lib/resources/tipoActivoFactor";
import { ActivoFactorRequest } from "@/components/tipoActivo/services/tipoActivoFactor.interface";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    const factorTipoActivo = await prisma.factorTipoActivo.findUnique({
      where: {
        id: id,
      },
      include: {
        anio: true,
        grupoActivo: true,
      },
    });

    if (!factorTipoActivo) {
      return NextResponse.json(
        { message: "Tipo Activo Factor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(formatTipoActivoFactor(factorTipoActivo));
  } catch (error) {
    console.error("Error finding tipo combustible factor", error);
    return NextResponse.json(
      { message: "Error finding tipo combustible factor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }
    const factor = await prisma.factorTipoActivo.findUnique({ where: { id } });
    if (!factor)
      return NextResponse.json(
        { message: "Factor Tipo de Activo no encontrado" },
        { status: 404 }
      );
    const body: ActivoFactorRequest = await req.json();
    const factorTipoActivo = await prisma.factorTipoActivo.update({
      where: {
        id: id,
      },
      include: {
        anio: true,
        grupoActivo: true,
      },
      data: {
        factor: body.factor,
        grupoActivoId: body.grupoActivoId,
        anioId: body.anioId,
        fuente: body.fuente,
        link: body.link,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      message: "Factor Tipo de Activo actualizado",
      factorTipoActivo: formatTipoActivoFactor(factorTipoActivo),
    });
  } catch (error) {
    console.error("Error actualizando Factor de Tipo de Activo", error);
    return NextResponse.json(
      { message: "Error actualizando Factor de Tipo de Activo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    await prisma.factorTipoActivo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Factor de Tipo de Activo eliminado" });
  } catch (error: any) {
    console.error("Error eliminando Factor de Tipo de Activo", error);
    return NextResponse.json(
      { message: "Error eliminando Factor de Tipo de Activo" },
      { status: 500 }
    );
  }
}
