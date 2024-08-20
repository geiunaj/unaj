import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import {formatTaxi} from "@/lib/resources/taxiResorce";
import {TaxiRequest} from "@/components/taxi/service/taxi.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const anio = searchParams.get("anioId") ?? undefined;
        const mesId = searchParams.get("mesId") ?? undefined;

        const sort = searchParams.get("sort") ?? "id";
        const direction = searchParams.get("direction") ?? "desc";

        console.log({sedeId, sort, direction});

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
                anio: true,
                sede: true,
                mes: true,
            },
            orderBy: {
                [sort]: direction,
            },
        });
        console.log(taxi);
        const formattedTaxi = taxi.map(formatTaxi);

        return NextResponse.json(formattedTaxi);
    } catch (error) {
        console.error("Error finding taxi", error);
        return new NextResponse("Error finding taxi", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TaxiRequest = await req.json();
        const taxi = await prisma.taxi.create({
            data: {
                unidadContratante: body.unidadContratante,
                lugarSalida: body.lugarSalida,
                lugarDestino: body.lugarDestino,
                montoGastado: body.monto,
                mes_id: body.mes_id,
                anio_id: body.anio_id,
                sede_id: body.sede_id,
            },
        });

        return NextResponse.json(taxi);
    } catch (error) {
        console.error("Error creating taxi", error);
        return new NextResponse("Error creating taxi", {status: 500});
    }
}
