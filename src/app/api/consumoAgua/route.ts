import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatElectricidad} from "@/lib/resources/electricidadResource";
import {
    electricidadCollection,
    electricidadRequest,
} from "@/components/consumoElectricidad/services/electricidad.interface";
import { formatConsumoAgua } from "@/lib/resources/consumoAgua.Resource";
import { consumoAguaCollection, consumoAguaRequest } from "@/components/consumoAgua/services/consumoAgua.interface";

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
            // sede_id: sedeId ? parseInt(sedeId) : undefined,
            anio_id: anioId,
            mes_id: mes ? parseInt(mes) : undefined,
            areaId: areaId ? parseInt(areaId) : undefined,
        };

        const totalRecords = await prisma.consumoAgua.count({where: whereOptions});
        const totalPages = Math.ceil(totalRecords / perPage);

        const consumoAgua = await prisma.consumoAgua.findMany({
            where: whereOptions,
            include: {
                mes: true,
                anio: true,
                area: true,
            },
            orderBy: sort
                ? [{[sort]: direction || 'desc'}]
                : [
                    {anio_id: 'desc'},
                    {mes_id: 'desc'}
                ],
            skip: (page - 1) * perPage,
            take: perPage,
        });

        const formattedConsumoAgua: consumoAguaCollection[] = consumoAgua.map(
            (consumoAgua) => formatConsumoAgua(consumoAgua)
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
        const consumoAgua = await prisma.consumoAgua.create({
            data: {
                aerea_id: body.area_id,
                codigoMedidor: body.codigoMedidor,
                fuenteAgua: body.fuenteAgua,
                consumo: body.consumo,
                anio_id: body.anio_id,
                mes_id: body.mes_id,

                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                area: true,
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
