import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatConsumoAgua} from "@/lib/resources/consumoAgua.Resource";
import {
    consumoAguaCollection,
    consumoAguaRequest,
} from "@/components/consumoAgua/services/consumoAgua.interface";
import {getAnioId} from "@/lib/utils";

// INDEX
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const areaId = searchParams.get("areaId") ?? undefined;
        const mesId = searchParams.get("mesId") ?? undefined;
        const dateFrom = searchParams.get("from") ?? undefined;
        const dateTo = searchParams.get("to") ?? undefined;
        const sort = searchParams.get("sort") ?? undefined;
        const direction = searchParams.get("direction") ?? undefined;

        const all = searchParams.get("all") === "true";
        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        let yearFrom, yearTo, monthFrom, monthTo;
        let yearFromId, yearToId, mesFromId, mesToId;

        if (dateFrom) [yearFrom, monthFrom] = dateFrom.split("-");
        if (dateTo) [yearTo, monthTo] = dateTo.split("-");
        if (yearFrom) yearFromId = await getAnioId(yearFrom);
        if (yearTo) yearToId = await getAnioId(yearTo);
        if (monthFrom) mesFromId = parseInt(monthFrom);
        if (monthTo) mesToId = parseInt(monthTo);

        const whereOptions = {
            area: {
                sede_id: sedeId ? parseInt(sedeId) : undefined,
            },
            area_id: areaId ? parseInt(areaId) : undefined,
            mes_id: mesId ? parseInt(mesId) : undefined,
        } as {
            area: {
                sede_id?: number;
            };
            area_id?: number;
            mes_id?: number;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        const from = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        if (from && to) {
            whereOptions.anio_mes = {gte: from, lte: to,};
        } else if (from) {
            whereOptions.anio_mes = {gte: from,};
        } else if (to) {
            whereOptions.anio_mes = {lte: to,};
        }

        const totalRecords = await prisma.consumoAgua.count({where: whereOptions,});
        const totalPages = Math.ceil(totalRecords / perPage);

        const consumoAgua = await prisma.consumoAgua.findMany({
            where: whereOptions,
            include: {
                mes: true,
                anio: true,
                area: {
                    include: {
                        sede: true,
                    },
                },
            },
            orderBy: all
                ? [{area: {sede_id: 'asc'}}, {area_id: 'asc'}, {anio_mes: 'asc'}]
                : sort
                    ? [{[sort]: direction || 'desc'}]
                    : [{area: {sede_id: "desc"}}, {area_id: "asc"}, {anio_id: "desc"}, {mes_id: "desc"}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedConsumoAgua: consumoAguaCollection[] = consumoAgua.map(
            (consumoAgua, index) => {
                const consumo = formatConsumoAgua(consumoAgua);
                consumo.rn = index + 1;
                return consumo;
            }
        );

        return NextResponse.json({
            data: formattedConsumoAgua,
            meta: {
                page,
                perPage,
                totalPages,
                totalRecords,
            },
        });
    } catch (error) {
        console.error("Error buscando consumos", error);
        return new NextResponse("Error buscando consumos", {status: 500});
    }
}

// CREATE
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: consumoAguaRequest = await req.json();
        const anio = await prisma.anio.findFirst({
            where: {id: body.anio_id},
        });
        if (!anio) return new NextResponse("Año no encontrado", {status: 404});
        const consumoAgua = await prisma.consumoAgua.create({
            data: {
                area_id: body.area_id,
                codigoMedidor: body.codigoMedidor,
                fuenteAgua: body.fuenteAgua,
                consumo: body.consumo,
                anio_id: body.anio_id,
                mes_id: body.mes_id,
                anio_mes: Number(anio.nombre) * 100 + Number(body.mes_id),

                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                area: {
                    include: {
                        sede: true,
                    },
                },
                mes: true,
                anio: true,
            },
        });

        const formattedConsumoAgua = formatConsumoAgua(consumoAgua);

        return NextResponse.json({
            message: "Consumo registrado",
            electricidad: formattedConsumoAgua,
        });
    } catch (error) {
        console.error("Error registrando consumo", error);
        return new NextResponse("Error registrando consumo", {status: 500});
    }
}
