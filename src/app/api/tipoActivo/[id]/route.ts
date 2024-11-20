import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {TipoActivoRequest} from "@/components/tipoActivo/services/tipoActivo.interface";
import {formatTipoActivo} from "@/lib/resources/tipoActivoResource";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id))
            return NextResponse.json({message: "Invalid ID"}, {status: 404});
        const tipoActivo = await prisma.tipoActivo.findUnique({
            where: {
                id: id,
            },
            include: {
                categoria: true,
            },
        });

        if (!tipoActivo)
            return NextResponse.json(
                {message: "Tipo Activo no encontrada"},
                {status: 404}
            );
        return NextResponse.json(formatTipoActivo(tipoActivo));
    } catch (error) {
        console.error("Error buscando Tipo Activo", error);
        return NextResponse.json(
            {message: "Error buscando Tipo Activo"},
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
            return NextResponse.json({message: "Invalid ID"}, {status: 400});
        const body: TipoActivoRequest = await req.json();

        const tipoActivo = await prisma.tipoActivo.update({
            where: {
                id: id,
            },
            data: {
                nombre: body.nombre,
                unidad: "Kg",
                peso: body.peso,
                fuente: body.fuente,
                costoUnitario: body.costoUnitario,
                categoriaId: body.categoriaId,
                updated_at: new Date(),
            },
            include: {
                categoria: true,
            },
        });

        return NextResponse.json({
            message: "Tipo Activo actualizado correctamente",
            tipoActivo: formatTipoActivo(tipoActivo),
        });
    } catch (error) {
        console.error("Error actualizando Tipo Activo", error);
        return NextResponse.json(
            {message: "Error actualizando Tipo Activo"},
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

        await prisma.tipoActivo.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Tipo Activo eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Tipo Activo", error);
        return NextResponse.json(
            {message: "Error eliminando Tipo Activo"},
            {status: 500}
        );
    }
}
