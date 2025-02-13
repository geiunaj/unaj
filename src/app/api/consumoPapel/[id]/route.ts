import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatConsumoPapel } from "@/lib/resources/papelResource";
import { ConsumoPapelRequest } from "@/components/consumoPapel/services/consumoPapel.interface";

// SHOW ROUTE -> PARAM [ID]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 404 });
    }

    const consumoPapel = await prisma.consumoPapel.findUnique({
      where: {
        id: id,
      },
      include: {
        tipoPapel: true,
        sede: true,
        anio: true,
        mes: true,
      },
    });

    if (!consumoPapel) {
      return NextResponse.json(
        { message: "ConsumoPapel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(consumoPapel);
  } catch (error) {
    console.error("Error finding combustible", error);
    return NextResponse.json(
      { message: "Error finding combustible" },
      { status: 500 }
    );
  }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    const body: ConsumoPapelRequest = await req.json();
    const tipoPapel = await prisma.tipoPapel.findUnique({
      where: { id: body.tipoPapel_id },
    });
    const anio = await prisma.anio.findFirst({
      where: { id: body.anio_id },
    });
    if (!anio)
      return NextResponse.json(
        { message: "Año no encontrado" },
        { status: 404 }
      );

    const updatedConsumoPapel = await prisma.consumoPapel.update({
      where: {
        id: id,
      },
      data: {
        tipoPapel_id: body.tipoPapel_id,
        cantidad_paquete: body.cantidad_paquete,
        peso:
          ((tipoPapel?.area ?? 0) *
            (tipoPapel?.hojas ?? 0) *
            (tipoPapel?.gramaje ?? 0) *
            body.cantidad_paquete) /
          1000,
        comentario: body.comentario,
        anio_id: body.anio_id,
        mes_id: body.mes_id,
        sede_id: body.sede_id,
        anio_mes: Number(anio.nombre) * 100 + Number(body.mes_id),

        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        tipoPapel: true,
        anio: true,
        sede: true,
        mes: true,
      },
    });

    return NextResponse.json({
      message: "Consumo de Papel actualizado corectamente",
      consumoPapel: updatedConsumoPapel,
    });
  } catch (error) {
    console.error("Error updating consumo papel", error);
    return NextResponse.json(
      { message: "Error updating consumo papel" },
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
    if (isNaN(id))
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });

    await prisma.consumoPapel.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Consumo de papel eliminada correctamente",
    });
  } catch (error: any) {
    console.error("Error eliminando Consumo de papel", error);
    return NextResponse.json(
      { message: "Error eliminando Consumo de papel" },
      { status: 500 }
    );
  }
}
