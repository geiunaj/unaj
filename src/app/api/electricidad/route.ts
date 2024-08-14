import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatElectricidad} from "@/lib/resources/electricidadResource";
import {
    electricidadCollection,
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

        let anioId;
        if (anio) {
            const anioRecord = await prisma.anio.findFirst({
                where: {
                    nombre: anio,
                },
            });
            anioId = anioRecord ? anioRecord.id : undefined;
        }

        const electricidad = await prisma.consumoEnergia.findMany({
            where: {
                sede_id: sedeId ? parseInt(sedeId) : undefined,
                anio_id: anioId,
                mes_id: mes ? parseInt(mes) : undefined,
                areaId: areaId ? parseInt(areaId) : undefined,
            },
            include: {
                mes: true,
                anio: true,
                sede: true,
                area: true,
            },
            orderBy: sort
                ? [{[sort]: direction || 'desc'}]
                : [
                    {anio_id: 'desc'},
                    {mes_id: 'desc'}
                ],
        });

        const formattedElectricidad: electricidadCollection[] = electricidad.map(
            (electricidad) => formatElectricidad(electricidad)
        );

        return NextResponse.json(formattedElectricidad);
    } catch (error) {
        console.error("Error buscando electricidad", error);
        return new NextResponse("Error buscando electricidad", {status: 500});
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
                sede_id: body.sede_id,
                anio_id: body.anio_id,
                mes_id: body.mes_id,

                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                area: true,
                mes: true,
                anio: true,
                sede: true,
            },
        });

        const formattedElectricidad = formatElectricidad(electricidad);

        return NextResponse.json({
            message: "Consumo registrado",
            electricidad: formattedElectricidad,
        });
    } catch (error) {
        console.error("Error registrando electricidad", error);
        return new NextResponse("Error registrando electricidad", {status: 500});
    }
}
