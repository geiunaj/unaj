import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatConsumoPapel} from "@/lib/resources/papelResource";
import {ConsumoPapelRequest} from "@/components/consumoPapel/services/consumoPapel.interface";


// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    console.log(params.id);
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", {status: 404});
        }

        const consumoPapel = await prisma.consumoPapel.findUnique({
            where: {
                id: id,
            },
            include: {
                tipoPapel: true,
                sede: true,
                anio: true,
            },
        });

        if (!consumoPapel) {
            return new NextResponse("ConsumoPapel not found", {status: 404});
        }

        return NextResponse.json(consumoPapel);
    } catch (error) {
        console.error("Error finding combustible", error);
        return new NextResponse("Error finding combustible", {status: 500});
    }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", {status: 400});
        }


        const {cantidad_paquete, tipoPapel_id, anio_id, sede_id, comentario}: ConsumoPapelRequest = await req.json();
        if (!cantidad_paquete || !tipoPapel_id || !anio_id || !sede_id) {
            return new NextResponse("Faltan campos requeridos", {status: 400});
        }

        const updatedConsumoPapel = await prisma.consumoPapel.update({
            where: {
                id: id,
            },
            data: {
                cantidad_paquete,
                tipoPapel_id,
                anio_id,
                sede_id,
                comentario,
            },
            include: {
                tipoPapel: true,
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Consumo de Papel actualizado corectamente",
            consumoPapel: updatedConsumoPapel,

        });

    } catch (error) {
        console.error("Error updating consumo papel", error);
        return new NextResponse("Error updating consumo papel", {status: 500});
    }
}

export async function DELETE(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("ID inválido", {status: 400});

        await prisma.consumoPapel.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Consumo de papel eliminada correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Consumo de papel", error);
        return new NextResponse("Error eliminando Consumo de papel", {status: 500});
    }
}
