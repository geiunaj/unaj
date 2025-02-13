import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { formatExtintor } from "@/lib/resources/extintorResource";
import { ExtintorRequest } from "@/components/extintor/service/extintor.interface";
import { getAnioId } from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const sedeId = searchParams.get("sedeId") ?? undefined;
    const anio = searchParams.get("anioId") ?? undefined;
    const mesId = searchParams.get("mesId") ?? undefined;
    const tipoExtintorId = searchParams.get("tipoExtintorId") ?? undefined;

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
      tipoExtintorId: tipoExtintorId ? parseInt(tipoExtintorId) : undefined,
    } as {
      sede_id?: number;
      anio_id: number | undefined;
      mes_id?: number;
      tipoExtintorId?: number;
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

    const totalRecords = await prisma.extintor.count({ where: whereOptions });
    const totalPages = Math.ceil(totalRecords / perPage);

    const extintor = await prisma.extintor.findMany({
      where: whereOptions,
      include: {
        mes: true,
        anio: true,
        sede: true,
        tipoExtintor: true,
        File: true,
      },
      orderBy: all
        ? [{ anio_mes: "desc" }]
        : sort
        ? [{ [sort]: direction || "desc" }]
        : [{ anio_mes: "desc" }],
      ...(all ? {} : { skip: (page - 1) * perPage, take: perPage }),
    });
    const formattedExtintor: any[] = extintor.map((extintor, index) => {
      const consumo = formatExtintor(extintor);
      consumo.rn = (page - 1) * perPage + index + 1;
      return consumo;
    });

    // const formattedExtintor = extintor.map(formatExtintor);

    return NextResponse.json({
      data: formattedExtintor,
      meta: {
        page,
        perPage,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error finding extintor", error);
    return NextResponse.json(
      { message: "Error finding extintor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: ExtintorRequest = await req.json();
    const anio = await prisma.anio.findFirst({
      where: { id: body.anio_id },
    });
    if (!anio)
      return NextResponse.json(
        { message: "Año no encontrado" },
        { status: 404 }
      );
    const extintor = await prisma.extintor.create({
      data: {
        consumo: body.consumo,
        mes_id: body.mes_id,
        anio_id: body.anio_id,
        sede_id: body.sede_id,
        tipoExtintorId: body.tipoExtintorId,
        anio_mes: Number(anio.nombre) * 100 + Number(body.mes_id),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        mes: true,
        anio: true,
        sede: true,
        tipoExtintor: true,
        File: true,
      },
    });

    const formattedExtintor = formatExtintor(extintor);

    return NextResponse.json({
      message: "Extintor registrado",
      fertilizante: formattedExtintor,
    });
  } catch (error) {
    console.error("Error registrando Extintor", error);
    return NextResponse.json(
      { message: "Error creando Extintor" },
      { status: 500 }
    );
  }
}
