import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { formatTransporteAereo } from "@/lib/resources/transporteAereoResource";
import { TransporteAereoRequest } from "@/components/transporteAereo/service/transporteAereo.interface";
import { getAnioId } from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const sedeId = searchParams.get("sedeId") ?? undefined;
    const anio = searchParams.get("anioId") ?? undefined;
    const mesId = searchParams.get("mesId") ?? undefined;

    const sort = searchParams.get("sort");
    const direction = searchParams.get("direction") ?? "desc";

    const all = searchParams.get("all") === "true";

    const page = parseInt(searchParams.get("page") ?? "1");
    const perPage = parseInt(searchParams.get("perPage") ?? "10");

    const dateFrom = searchParams.get("from") ?? undefined;
    const dateTo = searchParams.get("to") ?? undefined;

    let anioId;
    if (anio) anioId = await getAnioId(anio);

    let yearFrom, yearTo, monthFrom, monthTo;
    let yearFromId, yearToId, mesFromId, mesToId;

    if (dateFrom) [yearFrom, monthFrom] = dateFrom.split("-");
    if (dateTo) [yearTo, monthTo] = dateTo.split("-");
    if (yearFrom) yearFromId = await getAnioId(yearFrom);
    if (yearTo) yearToId = await getAnioId(yearTo);
    if (monthFrom) mesFromId = parseInt(monthFrom);
    if (monthTo) mesToId = parseInt(monthTo);

    const whereOptions = {
      sede_id: sedeId ? parseInt(sedeId) : undefined,
      anio_id: anioId,
      mes_id: mesId ? parseInt(mesId) : undefined,
    } as {
      sede_id?: number;
      anio_id: number | undefined;
      mes_id?: number;
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

    const totalRecords = await prisma.transporteAereo.count({
      where: whereOptions,
    });
    const totalPages = Math.ceil(totalRecords / perPage);

    const transporteAereo = await prisma.transporteAereo.findMany({
      where: whereOptions,
      include: {
        mes: true,
        anio: true,
        sede: true,
        File: true,
      },
      orderBy: all
        ? [{ anio_mes: "desc" }]
        : sort
        ? [{ [sort]: direction || "desc" }]
        : [{ anio_mes: "desc" }],
      ...(all ? {} : { skip: (page - 1) * perPage, take: perPage }),
    });
    const formattedTransporteAereo: any[] = transporteAereo.map(
      (transporteAereo, index) => {
        const consumo = formatTransporteAereo(transporteAereo);
        consumo.rn = (page - 1) * perPage + index + 1;
        return consumo;
      }
    );

    return NextResponse.json({
      data: formattedTransporteAereo,
      meta: {
        page,
        perPage,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error finding transporteAereo", error);
    return new NextResponse("Error finding transporteAereo", { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: TransporteAereoRequest = await req.json();
    const anio = await prisma.anio.findFirst({
      where: { id: body.anio_id },
    });
    if (!anio) return new NextResponse("Año no encontrado", { status: 404 });
    const transporteAereo = await prisma.transporteAereo.create({
      data: {
        numeroPasajeros: body.numeroPasajeros,
        origen: body.origen,
        destino: body.destino,
        isIdaVuelta: body.isIdaVuelta,
        fechaSalida: body.fechaSalida ? new Date(body.fechaSalida) : null,
        fechaRegreso: body.fechaRegreso ? new Date(body.fechaRegreso) : null,
        distanciaTramo: body.distanciaTramo,
        kmRecorrido: body.kmRecorrido,
        mes_id: body.mes_id,
        anio_id: body.anio_id,
        sede_id: body.sede_id,
        anio_mes: Number(anio.nombre) * 100 + Number(body.mes_id),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        mes: true,
        anio: true,
        sede: true,
        File: true,
      },
    });

    const formattedTransporteAereo = formatTransporteAereo(transporteAereo);

    return NextResponse.json({
      message: "Transporte Aereo registrado",
      fertilizante: formattedTransporteAereo,
    });
  } catch (error) {
    console.error("Error registrando Transporte Aereo", error);
    return new NextResponse("Error creando Transporte Aereo", { status: 500 });
  }
}
