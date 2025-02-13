import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAnioId } from "@/lib/utils";
import { TransporteCasaTrabajoRequest } from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajo.interface";
import { formatTransporteCasaTrabajo } from "@/lib/resources/transporteCasaTrabajoResource";

// INDEX
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const tipoVehiculoId = searchParams.get("tipoVehiculoId") ?? undefined;
    const tipo = searchParams.get("tipo") ?? undefined;
    const sedeId = searchParams.get("sedeId") ?? undefined;
    const anio = searchParams.get("anio") ?? undefined;
    const mesId = searchParams.get("mesId") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;
    const direction = searchParams.get("direction") ?? undefined;
    const all = searchParams.get("all") === "true";

    const page = parseInt(searchParams.get("page") ?? "1");
    const perPage = parseInt(searchParams.get("perPage") ?? "10");

    const dateFrom = searchParams.get("from") ?? undefined;
    const dateTo = searchParams.get("to") ?? undefined;

    let yearFrom, yearTo, monthFrom, monthTo;
    let yearFromId, yearToId, mesFromId, mesToId;

    if (dateFrom) [yearFrom, monthFrom] = dateFrom.split("-");
    if (dateTo) [yearTo, monthTo] = dateTo.split("-");
    if (yearFrom) yearFromId = await getAnioId(yearFrom);
    if (yearTo) yearToId = await getAnioId(yearTo);
    if (monthFrom) mesFromId = parseInt(monthFrom);
    if (monthTo) mesToId = parseInt(monthTo);

    const whereOptions = {
      tipoVehiculoId: tipoVehiculoId ? parseInt(tipoVehiculoId) : undefined,
      sedeId: sedeId ? parseInt(sedeId) : undefined,
      mesId: mesId ? parseInt(mesId) : undefined,
      tipo: tipo == "" ? undefined : tipo,
    } as {
      tipoVehiculoId?: number;
      sedeId?: number;
      mesId?: number;
      tipo?: string;
      anio_mes?: {
        gte?: number;
        lte?: number;
      };
    };

    const from =
      yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
    const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

    if (from && to) {
      whereOptions.anio_mes = { gte: from, lte: to };
    } else if (from) {
      whereOptions.anio_mes = { gte: from };
    } else if (to) {
      whereOptions.anio_mes = { lte: to };
    }

    const totalRecords = await prisma.casaTrabajo.count({
      where: whereOptions,
    });
    const totalPages = Math.ceil(totalRecords / perPage);

    const transporteCasaTrabajos = await prisma.casaTrabajo.findMany({
      where: whereOptions,
      include: {
        tipoVehiculo: true,
        mes: true,
        anio: true,
        sede: true,
        File: true,
      },
      orderBy: all
        ? [{ anio_mes: "desc" }]
        : sort
        ? [{ [sort]: direction || "desc" }]
        : [{ tipoVehiculo: { nombre: "desc" } }, { anio_mes: "desc" }],
      ...(all ? {} : { skip: (page - 1) * perPage, take: perPage }),
      // ...(limit ? {take: 100} : all ? {} : {skip: (page - 1) * perPage, take: perPage}),
    });

    const formattedTransporteCasaTrabajo: any[] = transporteCasaTrabajos.map(
      (transporteCasaTrabajo, index) => {
        const consumo = formatTransporteCasaTrabajo(transporteCasaTrabajo);
        consumo.rn = (page - 1) * perPage + index + 1;
        return consumo;
      }
    );

    return NextResponse.json({
      data: formattedTransporteCasaTrabajo,
      meta: {
        page,
        perPage,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error buscando consumos", error);
    return new NextResponse("Error buscando consumos", { status: 500 });
  }
}

// CREATE
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: TransporteCasaTrabajoRequest = await req.json();
    const anio = await prisma.anio.findFirst({
      where: { id: body.anioId },
    });
    if (!anio)
      return NextResponse.json(
        { message: "Año no encontrado" },
        { status: 404 }
      );
    const tipoVehiculo = await prisma.tipoVehiculo.findFirst({
      where: { id: body.tipoVehiculoId },
    });
    if (!tipoVehiculo)
      return NextResponse.json(
        { message: "Tipo de Vehiculo no encontrado" },
        { status: 404 }
      );
    const transporteCasaTrabajo = await prisma.casaTrabajo.create({
      data: {
        tipo: body.tipo,
        tipoVehiculoId: body.tipoVehiculoId,
        kmRecorrido: body.kmRecorrido,
        sedeId: body.sedeId,
        anioId: body.anioId,
        mesId: body.mesId,
        anio_mes: Number(anio.nombre) * 100 + Number(body.mesId),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        tipoVehiculo: true,
        sede: true,
        anio: true,
        mes: true,
        File: true,
      },
    });

    return NextResponse.json({
      message: "Transporte de Casa Trabajo registrado",
      transporteCasaTrabajo: formatTransporteCasaTrabajo(transporteCasaTrabajo),
    });
  } catch (error) {
    console.error("Error registrando consumo", error);
    return new NextResponse("Error registrando consumo", { status: 500 });
  }
}
