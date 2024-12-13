import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {ExtintorRequest} from "@/components/extintor/service/extintor.interface";
import {formatExtintor} from "@/lib/resources/extintorResource";

// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({message: "Invalid ID"}, {status: 400});
        }

        const extintor = await prisma.extintor.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
                sede: true,
                mes: true,
                tipoExtintor: true,
                File: true,
            },
        });

        if (!extintor) {
            return NextResponse.json({message: "Extintor no encontrado"}, {status: 404});
        }

        return NextResponse.json(formatExtintor(extintor));
    } catch (error) {
        console.error("Error buscando extintores", error);
        return NextResponse.json({message: "Error buscando extintores"}, {status: 500});
    }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Invalid ID"}, {status: 400});
        const body: ExtintorRequest = await req.json();
        const anio = await prisma.anio.findFirst({where: {id: body.anio_id},});
        const tipoExtintor = await prisma.tipoExtintor.findFirst({where: {id: body.tipoExtintorId},});
        if (!anio) return NextResponse.json({message: "Año no encontrado"}, {status: 404});
        if (!tipoExtintor) return NextResponse.json({message: "Tipo de Extintor no encontrado"}, {status: 404});

        const extintor = await prisma.extintor.update({
            where: {
                id: id,
            },
            data: {
                consumo: body.consumo,
                mes_id: body.mes_id,
                anio_id: body.anio_id,
                sede_id: body.sede_id,
                tipoExtintorId: body.tipoExtintorId,
                anio_mes: Number(anio.nombre) * 100 + Number(body.mes_id),
                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                anio: true,
                sede: true,
                mes: true,
                tipoExtintor: true,
                File: true,
            },
        });

        return NextResponse.json({
            message: "Registro de Extintor actualizado",
            extintor: formatExtintor(extintor),
        });
    } catch (error) {
        console.error("Error updating Extintor", error);
        return NextResponse.json({message: "Error updating Extintor"}, {status: 500});
    }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Invalid ID"}, {status: 400});
        await prisma.extintor.delete({where: {id: id,},});
        return NextResponse.json({message: "Registro de Extintor eliminado",});
    } catch (error) {
        console.error("Error deleting Extintor", error);
        return NextResponse.json({message: "Error deleting Extintor"}, {status: 500});
    }
}
