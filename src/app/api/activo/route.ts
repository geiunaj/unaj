import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAnioId } from "@/lib/utils";
import { ActivoRequest } from "@/components/activos/services/activos.interface";
import { formatActivo } from "@/lib/resources/activoResource";

// INDEX
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const tipoActivoId = searchParams.get("tipoActivoId") ?? undefined;
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
      tipoActivoId: tipoActivoId ? parseInt(tipoActivoId) : undefined,
      sedeId: sedeId ? parseInt(sedeId) : undefined,
      mesId: mesId ? parseInt(mesId) : undefined,
    } as {
      tipoActivoId?: number;
      sedeId?: number;
      mesId?: number;
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

    const totalRecords = await prisma.activo.count({ where: whereOptions });
    const totalPages = Math.ceil(totalRecords / perPage);

    const activos = await prisma.activo.findMany({
      where: whereOptions,
      include: {
        tipoActivo: {
          include: {
            categoria: true,
          },
        },
        mes: true,
        anio: true,
        sede: true,
        File: true,
      },
      orderBy: all
        ? [{ anio_mes: "asc" }]
        : sort
        ? [{ [sort]: direction || "desc" }]
        : [{ anioId: "desc" }, { mesId: "desc" }],
      ...(all ? {} : { skip: (page - 1) * perPage, take: perPage }),
      // ...(limit ? {take: 100} : all ? {} : {skip: (page - 1) * perPage, take: perPage}),
    });

    const formattedActivos: any[] = activos.map((activo, index) => {
      const consumo = formatActivo(activo);
      consumo.rn = (page - 1) * perPage + index + 1;
      return consumo;
    });

    return NextResponse.json({
      data: formattedActivos,
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
    const body: ActivoRequest = await req.json();
    const anio = await prisma.anio.findFirst({
      where: { id: body.anioId },
    });
    if (!anio)
      return NextResponse.json(
        { message: "Año no encontrado" },
        { status: 404 }
      );
    const tipoActivo = await prisma.tipoActivo.findFirst({
      where: { id: body.tipoActivoId },
    });
    if (!tipoActivo)
      return NextResponse.json(
        { message: "Tipo de activo no encontrado" },
        { status: 404 }
      );
    const activo = await prisma.activo.create({
      data: {
        tipoActivoId: body.tipoActivoId,
        sedeId: body.sedeId,
        anioId: body.anioId,
        mesId: body.mesId,
        anio_mes: Number(anio.nombre) * 100 + Number(body.mesId),
        cantidadComprada: body.cantidadComprada,
        cantidadConsumida: body.cantidadConsumida,
        costoTotal: body.cantidadConsumida * (tipoActivo.costoUnitario ?? 0),
        consumoTotal: body.cantidadConsumida * tipoActivo.peso,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        tipoActivo: {
          include: {
            categoria: true,
          },
        },
        sede: true,
        anio: true,
        mes: true,
        File: true,
      },
    });

    return NextResponse.json({
      message: "Activo registrado",
      activo: formatActivo(activo),
    });
  } catch (error) {
    console.error("Error registrando consumo", error);
    return new NextResponse("Error registrando consumo", { status: 500 });
  }
}
