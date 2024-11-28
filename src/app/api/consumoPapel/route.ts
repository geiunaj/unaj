import {
    ConsumoPapelCollectionItem,
    ConsumoPapelRequest
} from "@/components/consumoPapel/services/consumoPapel.interface";
import {formatConsumoPapel} from "@/lib/resources/papelResource";
import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import {getAnioId} from "@/lib/utils";
import {number} from "zod";
import {formatElectricidad} from "@/lib/resources/electricidadResource";


export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const sort = searchParams.get("sort") ?? "id";
        const direction = searchParams.get("direction") ?? "desc";
        const tipoPapelId = searchParams.get("tipoPapelId") ?? undefined;
        const anio = searchParams.get("anio") ?? undefined;
        const mesId = searchParams.get("mesId") ?? undefined;
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
            sede_id: sedeId ? parseInt(sedeId) : undefined,
            tipoPapel_id: tipoPapelId ? parseInt(tipoPapelId) : undefined,
            anio: {
                nombre: {
                    ...(yearFromId && yearToId ? {gte: yearFrom, lte: yearTo} :
                            yearFromId ? {gte: yearFrom} : yearToId ? {lte: yearTo} : undefined
                    ),
                }
            },
            mes_id: mesId ? parseInt(mesId) : undefined,
        } as {
            sede_id?: number;
            tipoPapel_id?: number;
            mes_id?: number;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        }

        const from = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        if (from && to) {
            whereOptions.anio_mes = {gte: from, lte: to,};
        } else if (from) {
            whereOptions.anio_mes = {gte: from,};
        } else if (to) {
            whereOptions.anio_mes = {lte: to,};
        }

        const totalRecords = await prisma.consumoPapel.count({where: whereOptions});
        const totalPages = Math.ceil(totalRecords / perPage);


        const consumopapel = await prisma.consumoPapel.findMany({
            where: whereOptions,
            include: {
                tipoPapel: true,
                anio: true,
                sede: true,
            },
            orderBy: all
                ? [{tipoPapel_id: 'asc'}, {anio_id: 'asc'}, {sede_id: 'asc'}]
                : sort

                    ? [{[sort]: direction || 'desc'}]
                    : [{tipoPapel_id: 'asc'}, {anio: {nombre: 'asc'}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedConsumoPapel: ConsumoPapelCollectionItem[] =
            consumopapel.map((consumopapel, index) => {
                const consumo = formatConsumoPapel(consumopapel)
                consumo.rn = (page - 1) * perPage + index + 1;
                return consumo;
            });


        return NextResponse.json(
            {
                data: formattedConsumoPapel,
                meta: {
                    page: page,
                    perPage: perPage,
                    totalPages: totalPages,
                    totalRecords: totalRecords,
                },
            }
        );
    } catch (error) {
        console.error("Error finding consumo papel", error);
        return new NextResponse("Error finding consumo papel", {status: 500});
    }
}


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: ConsumoPapelRequest = await req.json();
        const tipoPapel = await prisma.tipoPapel.findUnique({
            where: {id: body.tipoPapel_id},
        });
        const consumopapel = await prisma.consumoPapel.create({
            data: {
                tipoPapel_id: body.tipoPapel_id,
                cantidad_paquete: body.cantidad_paquete,
                peso: (tipoPapel?.area ?? 0) * (tipoPapel?.hojas ?? 0) * (tipoPapel?.gramaje ?? 0) * body.cantidad_paquete / 1000,
                comentario: body.comentario,
                anio_id: body.anio_id,
                mes_id: body.mes_id,
                sede_id: body.sede_id,

                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                tipoPapel: true,
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Tipo de consumo de papel creado correctamente",
            consumopapel: formatConsumoPapel(consumopapel),
        });
    } catch (error) {
        console.error("Error creating combustible", error);
        return new NextResponse("Error creating combustible", {status: 500});
    }
}


