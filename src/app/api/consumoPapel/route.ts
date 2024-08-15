import {ConsumoPapelRequest} from "@/components/consumoPapel/services/consumoPapel.interface";
import {formatConsumoPapel} from "@/lib/resources/papelResource";
import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";


export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const sort = searchParams.get("sort") ?? "id";
        const direction = searchParams.get("direction") ?? "desc";
        const tipoPapelId = searchParams.get("tipoPapelId") ?? undefined;
        const anio = searchParams.get("anio") ?? undefined;

        let anioId;
        if (anio) {
            const anioRecord = await prisma.anio.findFirst({
                where: {
                    nombre: anio,
                },
            });
            anioId = anioRecord ? anioRecord.id : undefined;
        }


        const consumopapel = await prisma.consumoPapel.findMany({
            where: {
                sede_id: sedeId ? parseInt(sedeId) : undefined,
                tipoPapel_id: tipoPapelId ? parseInt(tipoPapelId) : undefined,
                anio_id: anioId,
            },
            include: {
                tipoPapel: true,
                anio: true,
                sede: true,
            },
            orderBy: {
                [sort]: direction,
            },
        });

        const formattedConsumoPapel = consumopapel.map(formatConsumoPapel);

        return NextResponse.json(formattedConsumoPapel);
    } catch (error) {
        console.error("Error finding consumo papel", error);
        return new NextResponse("Error finding consumo papel", {status: 500});
    }
}


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: ConsumoPapelRequest = await req.json();
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

