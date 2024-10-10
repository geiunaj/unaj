import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatGrupoConsumible} from "@/lib/resources/grupoConsumibleResource";
import {GrupoConsumibleRequest} from "@/components/tipoConsumible/services/grupoConsumible.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 404});
        const grupo = await prisma.grupoConsumible.findUnique({
            where: {
                id: id,
            }
        });

        if (!grupo) return new NextResponse("Grupo no encontrada", {status: 404});
        return NextResponse.json(formatGrupoConsumible(grupo));
    } catch (error) {
        console.error("Error buscando grupo", error);
        return new NextResponse("Error buscando grupo", {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 400});

        const {nombre}: GrupoConsumibleRequest = await req.json();
        if (!nombre) return new NextResponse("Nombre es requerido", {status: 422});

        const grupoConsumible = await prisma.grupoConsumible.update({
            where: {
                id: id,
            },
            data: {
                nombre,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Grupo actualizada correctamente",
            grupo: formatGrupoConsumible(grupoConsumible),
        });
    } catch (error) {
        console.error("Error actualizando grupo", error);
        return new NextResponse("Error actualizando grupo", {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("ID inválido", {status: 400});

        await prisma.grupoConsumible.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Grupo eliminada correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando grupo", error);
        return new NextResponse("Error eliminando grupo", {status: 500});
    }
}
