import {formatCombustible} from "@/lib/resources/combustionResource";
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta sea correcta

// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    console.log(params.id);
    try {
        const id = parseInt(params.id);
        const combustible = await prisma.combustible.findUnique({
            where: {
                id: id,
            },
            include: {
                tipoCombustible: true,
                mes: true,
                anio: true,
                sede: true,
            },
        });

        if (!combustible) {
            return new NextResponse("Combustible not found", {status: 404});
        }

        return NextResponse.json(combustible);

        // return NextResponse.json(formatCombustible(combustible));
    } catch (error) {
        console.error("Error finding combustible", error);
        return new NextResponse("Error finding combustible", {status: 500});
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
        if (!body.tipo || !body.tipoEquipo || !body.consumo || !body.tipoCombustible_id || !body.mes_id || !body.anio_id || !body.sede_id) {
            return new NextResponse("Missing required fields", {status: 400});
        }

        const combustible = await prisma.combustible.update({
            where: {
                id: id,
            },
            data: {
                tipo: body.tipo,
                tipoEquipo: body.tipoEquipo,
                consumo: body.consumo,
                tipoCombustible_id: body.tipoCombustible_id,
                mes_id: body.mes_id,
                anio_id: body.anio_id,
                sede_id: body.sede_id,
                updated_at: new Date(),
            },
            include: {
                tipoCombustible: true,
                mes: true,
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Combustible actualizado",
            combustible: formatCombustible(combustible),
        });

    } catch (error) {
        console.error("Error actualizando combustible", error);
        return new NextResponse("Error actualizando combustible", {status: 500});
    }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        await prisma.combustible.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({
            message: "Combustible eliminado",
        });
    } catch (error) {
        console.error("Error deleting combustible", error);
        return new NextResponse("Error deleting combustible", {status: 500});
    }
}
