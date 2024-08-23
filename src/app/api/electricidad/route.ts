import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatElectricidad} from "@/lib/resources/electricidadResource";
import {
    electricidadCollection,
    electricidadCollectionItem,
    electricidadRequest,
} from "@/components/consumoElectricidad/services/electricidad.interface";

// INDEX
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);

        const sedeId = searchParams.get("sedeId") ?? undefined;
        const sort = searchParams.get("sort") ?? undefined;
        const direction = searchParams.get("direction") ?? undefined;
        const anio = searchParams.get("anioId") ?? undefined;
        const mes = searchParams.get("mesId") ?? undefined;
        const areaId = searchParams.get("areaId") ?? undefined;

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");


        let anioId;
        if (anio) {
            const anioRecord = await prisma.anio.findFirst({
                where: {
                    nombre: anio,
                },
            });
            anioId = anioRecord ? anioRecord.id : undefined;
        }

        const whereOptions = {
            area: {
                sede_id: sedeId ? parseInt(sedeId) : undefined,
            },
            anio_id: anioId,
            mes_id: mes ? parseInt(mes) : undefined,
            areaId: areaId ? parseInt(areaId) : undefined,
        };

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
            orderBy: sort
                ? [{[sort]: direction || 'desc'}]
                : [{area: {sede_id: "desc"}}, {areaId: "asc"}, {anio_id: "desc"}, {mes_id: "desc"}],
            skip: (page - 1) * perPage,
            take: perPage,
        });

        const formattedElectricidad: electricidadCollectionItem[] = electricidad.map(
            (electricidad) => formatElectricidad(electricidad)
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
        const electricidad = await prisma.consumoEnergia.create({
            data: {
                areaId: body.area_id,
                numeroSuministro: body.numeroSuministro,
                consumo: body.consumo,
                anio_id: body.anio_id,
                mes_id: body.mes_id,

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
