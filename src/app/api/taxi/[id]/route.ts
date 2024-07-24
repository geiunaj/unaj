import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta sea correcta
import { formatTaxi } from "@/lib/resources/taxiResorce";
import { TaxiRequest } from "@/components/taxi/service/taxi.interface";
import { Taxi } from "@prisma/client";

// INDEX
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const sort = searchParams.get("sort") ?? undefined;
        const direction = searchParams.get("direction") ?? undefined;
        const anio = searchParams.get("anioId") ?? undefined;
        const mesId = searchParams.get("mesId") ?? undefined;


        let anioId;
        if (anio) {
            const anioRecord = await prisma.anio.findFirst({
                where: {
                    nombre: anio,
                },
            });
            anioId = anioRecord ? anioRecord.id : undefined;
        }

        const taxi = await prisma.taxi.findMany({
            where: {
                sede_id: sedeId ? parseInt(sedeId) : undefined,
                anio_id: anioId,
                mes_id: mesId ? parseInt(mesId) : undefined,
            },
            include: {
                mes: true,
                anio: true,
                sede: true,
            },
            orderBy: {
                [sort ?? "id"]: direction ?? "desc",
            },
        });

        const formattedTaxi: Taxi[] = taxi.map(
            (taxi) => formatTaxi(taxi)
        );

        return NextResponse.json(formattedTaxi);
    } catch (error) {
        console.error("Error finding taxi", error);
        return new NextResponse("Error finding taxi", {status: 500});
    }
}

// CREATE
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TaxiRequest = await req.json();
        const taxi = await prisma.taxi.create({
            data: {
                unidadContratante: body.unidadContratante,
                lugarSalida: body.lugarSalida,
                lugarDestino: body.lugarDestino,
                montoGastado: body.monto,
                sede_id: body.sede_id,
                anio_id: body.anio_id,
                mes_id: body.mes_id,

                // created_at: new Date(),
                // updated_at: new Date(),
            },
            include: {
                mes: true,
                anio: true,
                sede: true,
            },
        });

        const formattedTaxi = formatTaxi(taxi);

        return NextResponse.json(formattedTaxi);
    } catch (error) {
        console.error("Error creating taxi", error);
        return new NextResponse("Error creating taxi", {status: 500});
    }
}
