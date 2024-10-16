import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTransporteAereoFactor} from "@/lib/resources/transporteAereoFactor.resource";
import {
    TransporteAereoFactorRequest
} from "@/components/transporte-aereo-factor/services/transporteAereoFactor.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const anio = await prisma.anio.findUnique({
            where: {
                id: id,
            },
        });

        if (!anio) {
            return new NextResponse("Año no encontrado", {status: 404});
        }

        return NextResponse.json(anio);
    } catch (error) {
        console.error("Error buscando Año", error);
        return new NextResponse("Error buscando Año", {status: 500});
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse("ID inválido", {status: 400});
        }

        const body = await req.json();
        const Anio = await prisma.anio.update({
            where: {
                id: id,
            },
            data: {
                nombre: body.nombre,
            },
        });

        return NextResponse.json({
            message: "Año actualizado correctamente",
            TransporteAereoFactor: Anio,
        });
    } catch (error) {
        console.error("Error actualizando Año", error);
        return new NextResponse("Error actualizando Año", {status: 500});
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

        await prisma.anio.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Año eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Año", error);
        return new NextResponse("Error eliminando Año", {status: 500});
    }
}
