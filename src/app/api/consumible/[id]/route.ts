import {formatCombustible} from "@/lib/resources/combustionResource";
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatConsumible} from "@/lib/resources/consumibleResource"; // Asegúrate de que la ruta sea correcta

// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const consumible = await prisma.consumible.findUnique({
            where: {
                id: id,
            },
            include: {
                tipoConsumible: {
                    include: {
                        descripcion: true,
                        categoria: true,
                        grupo: true,
                        proceso: true,
                    }
                },
                mes: true,
                anio: true,
                sede: true,
            },
        });

        if (!consumible) {
            return new NextResponse("Combustible not found", {status: 404});
        }
        return NextResponse.json(formatConsumible(consumible));
    } catch (error) {
        console.error("Error finding consumible", error);
        return new NextResponse("Error finding consumible", {status: 500});
    }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const body = await req.json();

        // VALIDATE BODY
        if (!body.tipo || !body.tipoEquipo || !body.consumo || !body.tipoConsumible_id || !body.mes_id || !body.anioId || !body.sedeId) {
            return new NextResponse("Missing required fields", {status: 400});
        }

        const consumible = await prisma.consumible.update({
            where: {
                id: id,
            },
            data: {
                pesoTotal: body.pesoTotal,
                tipoConsumibleId: body.tipoConsumibleId,
                sedeId: body.sedeId,
                anioId: body.anioId,
                mesId: body.mesId,
                updated_at: new Date(),
            },
            include: {
                tipoConsumible: true,
                mes: true,
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Combustible actualizado",
            consumible: formatCombustible(consumible),
        });

    } catch (error) {
        console.error("Error actualizando consumible", error);
        return new NextResponse("Error actualizando consumible", {status: 500});
    }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        await prisma.consumible.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({
            message: "Combustible eliminado",
        });
    } catch (error) {
        console.error("Error deleting consumible", error);
        return new NextResponse("Error deleting consumible", {status: 500});
    }
}
