import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { formatTaxi } from "@/lib/resources/taxiResource";
import { TaxiRequest } from "@/components/taxi/service/taxi.interface";
import { getAnioId } from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const sedeId = searchParams.get("sedeId") ?? undefined;
    const anio = searchParams.get("anioId") ?? undefined;
    const mesId = searchParams.get("mesId") ?? undefined;

    const sort = searchParams.get("sort") ?? "id";
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

    const totalRecords = await prisma.taxi.count({ where: whereOptions });
    const totalPages = Math.ceil(totalRecords / perPage);

    const taxi = await prisma.taxi.findMany({
      where: whereOptions,
      include: {
        anio: true,
        sede: true,
        mes: true,
        File: true,
      },
      orderBy: all
        ? [{ anio_mes: "desc" }]
        : sort
        ? [{ [sort]: direction || "desc" }]
        : [{ anio_mes: "desc" }],
      ...(all ? {} : { skip: (page - 1) * perPage, take: perPage }),
    });

    const formattedTaxi: any[] = taxi.map((taxi, index) => {
      const consumo = formatTaxi(taxi);
      consumo.rn = (page - 1) * perPage + index + 1;
      return consumo;
    });

    return NextResponse.json({
      data: formattedTaxi,
      meta: {
        page,
        perPage,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error finding taxi", error);
    return new NextResponse("Error finding taxi", { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: TaxiRequest = await req.json();
    const anio = await prisma.anio.findFirst({
      where: { id: body.anio_id },
    });
    if (!anio) return new NextResponse("Año no encontrado", { status: 404 });
    const taxi = await prisma.taxi.create({
      data: {
        unidadContratante: body.unidadContratante,
        lugarSalida: body.lugarSalida,
        lugarDestino: body.lugarDestino,
        montoGastado: body.montoGastado,
        kmRecorrido: body.kmRecorrido,
        mes_id: body.mes_id,
        anio_id: body.anio_id,
        sede_id: body.sede_id,
        anio_mes: Number(anio.nombre) * 100 + Number(body.mes_id),
      },
      include: {
        mes: true,
        anio: true,
        sede: true,
        File: true,
      },
    });

    const formattedTaxi = formatTaxi(taxi);

    return NextResponse.json({
      message: "Taxi creado exitosamente",
      fertilizante: formattedTaxi,
    });
  } catch (error) {
    console.error("Error creating taxi", error);
    return new NextResponse("Error creating taxi", { status: 500 });
  }
}
