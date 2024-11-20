import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatCategoriaActivo} from "@/lib/resources/categoriaActivoResource";
import {CategoriaActivoRequest} from "@/components/tipoActivo/services/categoriaActivo.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id))
            return NextResponse.json({message: "ID inválido"}, {status: 404});
        const categoria = await prisma.categoriaActivo.findUnique({
            where: {
                id: id,
            },
            include: {
                grupoActivo: true,
            },
        });

        if (!categoria)
            return NextResponse.json(
                {message: "Categoria no encontrada"},
                {status: 404}
            );
        return NextResponse.json(formatCategoriaActivo(categoria));
    } catch (error) {
        console.error("Error buscando categoria", error);
        return NextResponse.json(
            {message: "Error buscando categoria"},
            {status: 500}
        );
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id))
            return NextResponse.json({message: "ID inválido"}, {status: 400});

        const {nombre, grupoActivoId}: CategoriaActivoRequest = await req.json();
        if (!nombre)
            return NextResponse.json(
                {message: "Nombre es requerido"},
                {status: 400}
            );

        const categoriaActivo = await prisma.categoriaActivo.update({
            where: {
                id: id,
            },
            data: {
                nombre,
                grupoActivoId: grupoActivoId,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Categoria actualizada correctamente",
            categoria: formatCategoriaActivo(categoriaActivo),
        });
    } catch (error) {
        console.error("Error actualizando categoria", error);
        return NextResponse.json(
            {message: "Error actualizando categoria"},
            {status: 500}
        );
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id))
            return NextResponse.json({message: "ID inválido"}, {status: 400});

        await prisma.categoriaActivo.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Categoria eliminada correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando categoria", error);
        return NextResponse.json(
            {message: "Error eliminando categoria"},
            {status: 500}
        );
    }
}
