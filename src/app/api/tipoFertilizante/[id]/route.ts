import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatFertilizante} from "@/lib/resources/tipoFertilizante";
import {TipoFertilizanteRequest} from "@/components/tipoFertilizante/services/tipoFertilizante.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    console.log(params.id);
    try {
        const id = parseInt(params.id);
        const tipoFertilizante = await prisma.tipoFertilizante.findUnique({
            where: {
                id: id,
            },
        });

        if (!tipoFertilizante) {
            return new NextResponse("Tipo fertilizante not found", {status: 404});
        }

        return NextResponse.json(formatFertilizante(tipoFertilizante));
    } catch (error) {
        console.error("Error finding tipo fertilizante", error);
        return new NextResponse("Error finding tipo fertilizante", {status: 500});
    }
}

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
        const {
            nombre,
            porcentaje_nitrogeno,
            unidad,
            clase,
        } = body;
        if (
            (nombre && (typeof nombre !== "string")) ||
            (porcentaje_nitrogeno && (typeof porcentaje_nitrogeno !== "number")) ||
            (unidad && (typeof unidad !== "string")) ||
            (clase && (typeof clase !== "string"))
        ) {
            return new NextResponse("Missing or invalid required fields", {status: 404});
        }

        const tipoFertilizanteRequest: TipoFertilizanteRequest = {
            nombre: nombre,
            porcentajeNitrogeno: porcentaje_nitrogeno,
            unidad: unidad,
            clase: clase,
        };

        const tipoFertilizante = await prisma.tipoFertilizante.update({
            where: {
                id: id,
            },
            data: tipoFertilizanteRequest,
        });

        return NextResponse.json({
            message: "Tipo de fertilizante actualizado",
            tipoFertilizante: formatFertilizante(tipoFertilizante),
        });
    } catch (error) {
        console.error("Error actualizando tipo de fertilizante", error);
        return new NextResponse("Error actualizando tipo de fertilizante", {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse("ID inválido", {status: 400});
        }

        await prisma.tipoFertilizante.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Tipo de fertilizante eliminado",
        });
    } catch (error: any) {
        console.error("Error eliminando tipo de fertilizante", error);
        return new NextResponse("Error eliminando tipo de fertilizante", {status: 500});
    }
}
