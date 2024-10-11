import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatProcesoConsumible} from "@/lib/resources/procesoConsumibleResource";
import { ProcesoConsumibleRequest } from "@/components/tipoConsumible/services/procesoConsumible.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 404});
        const proceso = await prisma.procesoConsumible.findUnique({
            where: {
                id: id,
            }
        });

        if (!proceso) return new NextResponse("Proceso no encontrada", {status: 404});
        return NextResponse.json(formatProcesoConsumible(proceso));
    } catch (error) {
        console.error("Error buscando proceso", error);
        return new NextResponse("Error buscando proceso", {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 400});

        const {nombre}: ProcesoConsumibleRequest = await req.json();
        if (!nombre) return new NextResponse("Nombre es requerido", {status: 422});

        const procesoConsumible = await prisma.procesoConsumible.update({
            where: {
                id: id,
            },
            data: {
                nombre,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Proceso actualizada correctamente",
            proceso: formatProcesoConsumible(procesoConsumible),
        });
    } catch (error) {
        console.error("Error actualizando proceso", error);
        return new NextResponse("Error actualizando proceso", {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("ID inválido", {status: 400});

        await prisma.procesoConsumible.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Proceso eliminada correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando proceso", error);
        return new NextResponse("Error eliminando proceso", {status: 500});
    }
}
