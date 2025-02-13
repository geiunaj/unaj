import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatConsumible } from "@/lib/resources/consumibleResource";
import { ConsumibleRequest } from "@/components/consumibles/services/consumible.interface"; // Asegúrate de que la ruta sea correcta

// SHOW ROUTE -> PARAM [ID]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    const consumible = await prisma.consumible.findUnique({
      where: {
        id: id,
      },
      include: {
        tipoConsumible: {
          include: {
            descripcion: true,
            categoria: true,
            grupo: true,
            proceso: true,
          },
        },
        mes: true,
        anio: true,
        sede: true,
        File: true,
      },
    });

    if (!consumible) {
      return new NextResponse("Consumible not found", { status: 404 });
    }
    return NextResponse.json(formatConsumible(consumible));
  } catch (error) {
    return new NextResponse("Error finding consumible", { status: 500 });
  }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    const body: ConsumibleRequest = await req.json();
    const anio = await prisma.anio.findFirst({
      where: { id: body.anioId },
    });
    if (!anio) return new NextResponse("Año no encontrado", { status: 404 });
    const consumible = await prisma.consumible.update({
      where: {
        id: id,
      },
      data: {
        pesoTotal: body.pesoTotal,
        tipoConsumibleId: body.tipoConsumibleId,
        sedeId: body.sedeId,
        anioId: body.anioId,
        mesId: body.mesId,
        updated_at: new Date(),
      },
      include: {
        tipoConsumible: {
          include: {
            descripcion: true,
            categoria: true,
            grupo: true,
            proceso: true,
          },
        },
        mes: true,
        anio: true,
        sede: true,
        File: true,
      },
    });

    return NextResponse.json({
      message: "Consumible actualizado",
      consumible: formatConsumible(consumible),
    });
  } catch (error) {
    return new NextResponse("Error actualizando consumible", { status: 500 });
  }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id);
    await prisma.consumible.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Consumible eliminado",
    });
  } catch (error) {
    return new NextResponse("Error deleting consumible", { status: 500 });
  }
}
