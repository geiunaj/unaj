import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatCategoriaConsumible} from "@/lib/resources/categoriaConsumibleResource";
import {CategoriaConsumibleRequest} from "@/components/tipoConsumible/services/categoriaConsumible.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 404});
        const categoria = await prisma.categoriaConsumible.findUnique({
            where: {
                id: id,
            }
        });

        if (!categoria) return new NextResponse("Categoria no encontrada", {status: 404});
        return NextResponse.json(formatCategoriaConsumible(categoria));
    } catch (error) {
        console.error("Error buscando categoria", error);
        return new NextResponse("Error buscando categoria", {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 400});

        const {nombre}: CategoriaConsumibleRequest = await req.json();
        if (!nombre) return new NextResponse("Nombre es requerido", {status: 422});

        const categoriaConsumible = await prisma.categoriaConsumible.update({
            where: {
                id: id,
            },
            data: {
                nombre,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Categoria actualizada correctamente",
            categoria: formatCategoriaConsumible(categoriaConsumible),
        });
    } catch (error) {
        console.error("Error actualizando categoria", error);
        return new NextResponse("Error actualizando categoria", {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("ID inválido", {status: 400});

        await prisma.categoriaConsumible.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Categoria eliminada correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando categoria", error);
        return new NextResponse("Error eliminando categoria", {status: 500});
    }
}
