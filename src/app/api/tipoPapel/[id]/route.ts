import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TipoPapelRequest } from "@/components/tipoPapel/services/tipoPapel.interface";
import { formatTipoPapel } from "@/lib/resources/tipoPapel.resource";

// SHOW ROUTE -> PARAM [ID]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 404 });
    }

    const tipoPapel = await prisma.tipoPapel.findUnique({
      where: {
        id: id,
      },
    });

    if (!tipoPapel) {
      return new NextResponse("Tipo Papel not found", { status: 404 });
    }

    return NextResponse.json(formatTipoPapel(tipoPapel));
  } catch (error) {
    console.error("Error finding tipoPapel", error);
    return new NextResponse("Error finding tipoPapel", { status: 500 });
  }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const body = await req.json();
    const {
      nombre,
      ancho,
      largo,
      area,
      gramaje,
      unidad_paquete,
      porcentaje_reciclado,
      nombre_certificado,
    } = body;
    if (
      (nombre && typeof nombre !== "string") ||
      (gramaje && typeof gramaje !== "number") ||
      (unidad_paquete && typeof unidad_paquete !== "string") ||
      (porcentaje_reciclado && typeof porcentaje_reciclado !== "number") ||
      (nombre_certificado && typeof nombre_certificado !== "string")
    ) {
      return new NextResponse("Missing or invalid required fields", {
        status: 404,
      });
    }

    const tipoPapelRequest: TipoPapelRequest = {
      nombre: nombre,
      ancho: ancho,
      largo: largo,
      area: (ancho * largo) / 10000,
      gramaje: gramaje,
      unidad_paquete: unidad_paquete,
      porcentaje_reciclado: porcentaje_reciclado,
      nombre_certificado: nombre_certificado,
    };

    const tipoPapel = await prisma.tipoPapel.update({
      where: {
        id: id,
      },
      data: tipoPapelRequest,
    });

    return NextResponse.json({
      message: "Tipo de Papel actualizado correctamente",
      tipoPapel: formatTipoPapel(tipoPapel),
    });
  } catch (error) {
    console.error("Error actualizando tipo de papel", error);
    return new NextResponse("Error actualizando tipo de papel", {
      status: 500,
    });
  }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("ID inválido", { status: 400 });
    }

    await prisma.tipoPapel.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Tipo de Papel eliminado correctamente",
    });
  } catch (error: any) {
    console.error("Error eliminando tipo de papel", error);
    return new NextResponse("Error eliminando tipo de papel", { status: 500 });
  }
}
