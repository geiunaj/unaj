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

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        const all = searchParams.get("all") === "true";
        const yearFrom = searchParams.get("yearFrom") ?? undefined;
        const yearTo = searchParams.get("yearTo") ?? undefined;

        let yearFromId: number | undefined;
        let yearToId: number | undefined;

        if (yearFrom) yearFromId = await getAnioId(yearFrom);
        if (yearTo) yearToId = await getAnioId(yearTo);


        const whereOptions = {

            sede_id: sedeId ? parseInt(sedeId) : undefined,
            tipoPapel_id: tipoPapelId ? parseInt(tipoPapelId) : undefined,
            anio: {
                nombre: {
                    ...(yearFromId && yearToId ? {gte: yearFrom, lte: yearTo} :
                            yearFromId ? {gte: yearFrom} : yearToId ? {lte: yearTo} : undefined
                    ),
                }
            }
        };

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
                consumo.rn = index + 1;
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

        // Validar campos 
        if (
            typeof body.tipoPapel_id !== "number" ||
            typeof body.anio_id !== "number" ||
            typeof body.sede_id !== "number" ||
            typeof body.cantidad_paquete !== "number"
        ) {
            return new NextResponse("Campos requeridos faltantes", {
                status: 400,
            });
        }

        const consumopapel = await prisma.consumoPapel.create({
            data: {
                tipoPapel_id: body.tipoPapel_id,
                anio_id: body.anio_id,
                sede_id: body.sede_id,
                cantidad_paquete: body.cantidad_paquete,
                comentario: body.comentario,

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


