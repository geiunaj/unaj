import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatDescripcionConsumible} from "@/lib/resources/descripcionConsumibleResource";
import {DescripcionConsumibleRequest} from "@/components/tipoConsumible/services/descripcionConsumible.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 404});
        const descripcion = await prisma.descripcionConsumible.findUnique({
            where: {
                id: id,
            }
        });

        if (!descripcion) return new NextResponse("Descripcion no encontrada", {status: 404});
        return NextResponse.json(formatDescripcionConsumible(descripcion));
    } catch (error) {
        console.error("Error buscando descripcion", error);
        return new NextResponse("Error buscando descripcion", {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 400});

        const {descripcion}: DescripcionConsumibleRequest = await req.json();
        if (!descripcion) return new NextResponse("Nombre es requerido", {status: 422});

        const descripcionConsumible = await prisma.descripcionConsumible.update({
            where: {
                id: id,
            },
            data: {
                descripcion,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Descripcion actualizada correctamente",
            descripcion: formatDescripcionConsumible(descripcionConsumible),
        });
    } catch (error) {
        console.error("Error actualizando descripcion", error);
        return new NextResponse("Error actualizando descripcion", {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("ID inválido", {status: 400});

        await prisma.descripcionConsumible.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Descripcion eliminada correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando descripcion", error);
        return new NextResponse("Error eliminando descripcion", {status: 500});
    }
}
