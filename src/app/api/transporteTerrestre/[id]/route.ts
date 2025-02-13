import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TransporteTerrestreRequest } from "@/components/transporteTerrestre/service/transporteTerrestre.interface";
import { formatTransporteTerrestre } from "@/lib/resources/transporteTerrestreResource";

// SHOW ROUTE -> PARAM [ID]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const transporteTerrestre = await prisma.transporteTerrestre.findUnique({
      where: {
        id: id,
      },
      include: {
        anio: true,
        sede: true,
        mes: true,
        File: true,
      },
    });

    if (!transporteTerrestre) {
      return new NextResponse("TransporteTerrestre not found", { status: 404 });
    }

    return NextResponse.json(formatTransporteTerrestre(transporteTerrestre));
  } catch (error) {
    console.error("Error finding transporteTerrestre", error);
    return new NextResponse("Error finding transporteTerrestre", {
      status: 500,
    });
  }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return new NextResponse("Invalid ID", { status: 400 });
    const body: TransporteTerrestreRequest = await req.json();
    const anio = await prisma.anio.findFirst({ where: { id: body.anio_id } });
    if (!anio) return new NextResponse("Año no encontrado", { status: 404 });

    const transporteTerrestre = await prisma.transporteTerrestre.update({
      where: {
        id: id,
      },
      data: {
        numeroPasajeros: body.numeroPasajeros,
        origen: body.origen,
        destino: body.destino,
        isIdaVuelta: body.isIdaVuelta,
        fechaSalida: body.fechaSalida ? new Date(body.fechaSalida) : null,
        fechaRegreso: body.fechaRegreso ? new Date(body.fechaRegreso) : null,
        motivo: body.motivo,
        numeroComprobante: body.numeroComprobante,
        distancia: body.distancia,
        mes_id: body.mes_id,
        anio_id: body.anio_id,
        sede_id: body.sede_id,
        anio_mes: Number(anio.nombre) * 100 + Number(body.mes_id),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        anio: true,
        sede: true,
        mes: true,
        File: true,
      },
    });

    return NextResponse.json({
      message: "Registro de Transporte Terrestre actualizado",
      transporteTerrestre: formatTransporteTerrestre(transporteTerrestre),
    });
  } catch (error) {
    console.error("Error updating Transporte Terrestre", error);
    return new NextResponse("Error updating Transporte Terrestre", {
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
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const transporteTerrestre = await prisma.transporteTerrestre.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Registro de Transporte Terrestre eliminado",
    });
  } catch (error) {
    console.error("Error deleting Transporte Terrestre", error);
    return new NextResponse("Error deleting Transporte Terrestre", {
      status: 500,
    });
  }
}
