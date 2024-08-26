import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formaFertilizante} from "@/lib/resources/fertilizanteResource";
import {FertilizanteRequest} from "@/components/fertilizantes/services/fertilizante.interface";

// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    console.log(params.id);
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", {status: 400});
        }

        const fertilizante = await prisma.fertilizante.findUnique({
            where: {
                id: id,
            },
            include: {
                tipoFertilizante: true,
                anio: true,
                sede: true,
            },
        });

        if (!fertilizante) {
            return new NextResponse("Fertilizante not found", {status: 404});
        }

        return NextResponse.json(fertilizante);

    } catch (error) {
        console.error("Error finding fertilizante", error);
        return new NextResponse("Error finding fertilizante", {status: 500});
    }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", {status: 400});
        }
        
        const body = await req.json();
        console.log(body);

        // Validate required fields
        const {cantidad, is_ficha, tipoFertilizante_id, anio_id, sede_id} = body;
        if (
            typeof cantidad !== 'number' ||
            typeof is_ficha !== 'boolean' ||
            // typeof ficha_id !== 'number' ||
            typeof tipoFertilizante_id !== 'number' ||
            typeof anio_id !== 'number' ||
            typeof sede_id !== 'number'
        ) {
            return new NextResponse("Missing or invalid required fields", {status: 400});
        }

        const fertilizanteRequest: FertilizanteRequest = {
            tipoFertilizante_id,
            cantidad,
            is_ficha,
            // ficha_id,
            sede_id,
            anio_id,
        }

        const fertilizante = await prisma.fertilizante.update({
            where: {
                id: id,
            },
            data: fertilizanteRequest,
            include: {
                tipoFertilizante: true,
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Fertilizante actualizado",
            fertilizante: formaFertilizante(fertilizante),
        });
    } catch (error) {
        console.error("Error updating fertilizante", error);
        return new NextResponse("Error updating fertilizante", {status: 500});
    }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", {status: 400});
        }

        const fertilizante = await prisma.fertilizante.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({
            message: "Fertilizante eliminado",
        });
    } catch (error) {
        console.error("Error deleting fertilizante", error);
        return new NextResponse("Error deleting fertilizante", {status: 500});
    }
}
