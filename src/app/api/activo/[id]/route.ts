import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatActivo} from "@/lib/resources/activoResource";
import {ActivoRequest} from "@/components/activos/services/activos.interface"; // Asegúrate de que la ruta sea correcta

// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const activo = await prisma.activo.findUnique({
            where: {
                id: id,
            },
            include: {
                tipoActivo: {
                    include: {
                        categoria: true,
                    }
                },
                mes: true,
                anio: true,
                sede: true,
            },
        });

        if (!activo) {
            return NextResponse.json({message: "Activo not found"}, {status: 404});
        }
        return NextResponse.json(formatActivo(activo));
    } catch (error) {
        console.error("Error finding activo", error);
        return NextResponse.json({message: "Error finding activo"}, {status: 500});
    }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const body: ActivoRequest = await req.json();
        const anio = await prisma.anio.findFirst({
            where: {id: body.anioId},
        });
        if (!anio) return NextResponse.json({message: "Año no encontrado"}, {status: 404});
        const tipoActivo = await prisma.tipoActivo.findFirst({
            where: {id: body.tipoActivoId},
        });
        if (!tipoActivo) return NextResponse.json({message: "Tipo de activo no encontrado"}, {status: 404});
        const activo = await prisma.activo.update({
            where: {
                id: id,
            },
            data: {
                tipoActivoId: body.tipoActivoId,
                sedeId: body.sedeId,
                anioId: body.anioId,
                mesId: body.mesId,
                anio_mes: Number(anio.nombre) * 100 + Number(body.mesId),
                cantidadComprada: body.cantidadComprada,
                cantidadConsumida: body.cantidadConsumida,
                costoTotal: body.cantidadConsumida * (tipoActivo.costoUnitario ?? 0),
                consumoTotal: body.cantidadConsumida * tipoActivo.peso,
                updated_at: new Date(),
            },
            include: {
                tipoActivo: {
                    include: {
                        categoria: true,
                    }
                },
                mes: true,
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Activo actualizado",
            activo: formatActivo(activo),
        });

    } catch (error) {
        console.error("Error actualizando activo", error);
        return NextResponse.json("Error actualizando activo", {status: 500});
    }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        await prisma.activo.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({
            message: "Activo eliminado",
        });
    } catch (error) {
        console.error("Error deleting activo", error);
        return NextResponse.json({message: "Error deleting activo"}, {status: 500});
    }
}
