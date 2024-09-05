import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatElectricidad} from "@/lib/resources/electricidadResource";
import {
    electricidadCollection,
    electricidadCollectionItem,
    electricidadRequest,
} from "@/components/consumoElectricidad/services/electricidad.interface";
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
            mes_id: mesId ? parseInt(mesId) : undefined,
            areaId: areaId ? parseInt(areaId) : undefined,
        } as {
            area: {
                sede_id: number | undefined;
            };
            mes_id: number | undefined;
            areaId: number | undefined;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        const from = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        if (from && to) {
            whereOptions.anio_mes = {
                gte: from,
                lte: to,
            };
        } else if (from) {
            whereOptions.anio_mes = {
                gte: from,
            };
        } else if (to) {
            whereOptions.anio_mes = {
                lte: to,
            };
        }
        console.log(whereOptions);

        const totalRecords = await prisma.consumoEnergia.count({where: whereOptions});
        const totalPages = Math.ceil(totalRecords / perPage);

        const electricidad = await prisma.consumoEnergia.findMany({
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
                ? [{area: {sede_id: 'asc'}}, {areaId: 'asc'}, {anio_mes: 'asc'}]
                : sort
                    ? [{[sort]: direction || 'desc'}]
                    : [{area: {sede_id: "desc"}}, {areaId: "asc"}, {anio_id: "desc"}, {mes_id: "desc"}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedElectricidad: any[] = electricidad.map(
            (electricidad, index) => {
                const consumo = formatElectricidad(electricidad);
                consumo.rn = index + 1;
                return consumo;
            }
        );

        return NextResponse.json({
            data: formattedElectricidad,
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
        const body: electricidadRequest = await req.json();
        const anio = await prisma.anio.findFirst({
            where: {id: body.anio_id},
        });
        if (!anio) return new NextResponse("Año no encontrado", {status: 404});

        const electricidad = await prisma.consumoEnergia.create({
            data: {
                areaId: body.area_id,
                numeroSuministro: body.numeroSuministro,
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
                    }
                },
                mes: true,
                anio: true,
            },
        });

        const formattedElectricidad = formatElectricidad(electricidad);

        return NextResponse.json({
            message: "Consumo registrado",
            electricidad: formattedElectricidad,
        });
    } catch (error) {
        console.error("Error registrando consumo", error);
        return new NextResponse("Error registrando consumo", {status: 500});
    }
}
