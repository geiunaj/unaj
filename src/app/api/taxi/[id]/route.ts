import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {TaxiRequest} from "@/components/taxi/service/taxi.interface";
import {formatTaxi} from "@/lib/resources/taxiResorce";

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

        const taxi = await prisma.taxi.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
                sede: true,
                mes: true,
            },
        });

        if (!taxi) {
            return new NextResponse("Taxi not found", {status: 404});
        }

        return NextResponse.json(taxi);
    } catch (error) {
        console.error("Error finding taxi", error);
        return new NextResponse("Error finding taxi", {status: 500});
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

        // Validate required fields
        const {unidadContratante, lugarSalida, lugarDestino, montoGastado, mes_id, sede_id, anio_id} = body;
        if (!unidadContratante || !lugarSalida || !lugarDestino || !montoGastado || !mes_id || !sede_id || !anio_id) {
            return new NextResponse("Missing required fields", {status: 400});
        }

        const taxiRequest: TaxiRequest = {
            unidadContratante,
            lugarSalida,
            lugarDestino,
            montoGastado,
            mes_id,
            sede_id,
            anio_id,
            updated_at: new Date(),
        };

        const taxi = await prisma.taxi.update({
            where: {
                id: id,
            },
            data: taxiRequest,
            include: {
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Registro de taxi actualizado",
            taxi: formatTaxi(taxi),
        });
    } catch (error) {
        console.error("Error updating taxi", error);
        return new NextResponse("Error updating taxi", {status: 500});
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

        const taxi = await prisma.taxi.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({
            message: "Registro de taxi eliminado",
        });
    } catch (error) {
        console.error("Error deleting taxi", error);
        return new NextResponse("Error deleting taxi", {status: 500});
    }
}
