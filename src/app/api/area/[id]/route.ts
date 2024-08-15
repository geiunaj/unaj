import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {AreaRequest} from "@/components/area/services/area.interface";
import {formatArea} from "@/lib/resources/areaResource";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 404});
        const area = await prisma.area.findUnique({
            where: {
                id: id,
            }
        });

        if (!area) return new NextResponse("Area no encontrada", {status: 404});
        return NextResponse.json(formatArea(area));
    } catch (error) {
        console.error("Error buscando area", error);
        return new NextResponse("Error buscando area", {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 400});

        const {nombre}: AreaRequest = await req.json();
        if (!nombre) {
            return new NextResponse("Nombre es requerido", {status: 422});
        }

        const area = await prisma.area.update({
            where: {
                id: id,
            },
            data: {
                nombre,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Area actualizada correctamente",
            area: formatArea(area),
        });
    } catch (error) {
        console.error("Error actualizando area", error);
        return new NextResponse("Error actualizando area", {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("ID inválido", {status: 400});

        await prisma.area.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Area eliminada correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando area", error);
        return new NextResponse("Error eliminando area", {status: 500});
    }
}
