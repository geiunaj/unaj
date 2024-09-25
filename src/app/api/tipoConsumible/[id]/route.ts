import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {TipoConsumibleRequest} from "@/components/tipoConsumible/services/tipoConsumible.interface";
import {formatTipoConsumible} from "@/lib/resources/tipoConsumibleResource";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 404});
        const tipoConsumible = await prisma.tipoConsumible.findUnique({
            where: {
                id: id,
            },
            include: {
                descripcion: true,
                categoria: true,
                grupo: true,
                proceso: true,
            },
        });

        if (!tipoConsumible) return new NextResponse("Tipo Consumible no encontrada", {status: 404});
        return NextResponse.json(formatTipoConsumible(tipoConsumible));
    } catch (error) {
        console.error("Error buscando Tipo Consumible", error);
        return new NextResponse("Error buscando Tipo Consumible", {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 400});
        const body: TipoConsumibleRequest = await req.json();

        const tipoConsumible = await prisma.tipoConsumible.update({
            where: {
                id: id,
            },
            data: {
                nombre: body.nombre,
                unidad: body.unidad,
                descripcionId: body.descripcionId,
                categoriaId: body.categoriaId,
                grupoId: body.grupoId,
                procesoId: body.procesoId,
                updated_at: new Date(),
            },
            include: {
                descripcion: true,
                categoria: true,
                grupo: true,
                proceso: true,
            }
        });

        return NextResponse.json({
            message: "Tipo Consumible actualizado correctamente",
            tipoConsumible: formatTipoConsumible(tipoConsumible),
        });
    } catch (error) {
        console.error("Error actualizando Tipo Consumible", error);
        return new NextResponse("Error actualizando Tipo Consumible", {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("ID inválido", {status: 400});

        await prisma.tipoConsumible.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Tipo Consumible eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Tipo Consumible", error);
        return new NextResponse("Error eliminando Tipo Consumible", {status: 500});
    }
}
