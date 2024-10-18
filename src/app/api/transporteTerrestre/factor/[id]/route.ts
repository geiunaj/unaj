import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTransporteTerrestreFactor} from "@/lib/resources/transporteTerrestreFactor.resource";
import {
    TransporteTerrestreFactorRequest
} from "@/components/transporte-terrestre-factor/services/transporteTerrestreFactor.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const TransporteTerrestreFactor = await prisma.factorEmisionTransporteTerrestre.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
            },
        });

        if (!TransporteTerrestreFactor) {
            return new NextResponse("Factor de Transporte Terrestre no encontrado", {status: 404});
        }

        return NextResponse.json(formatTransporteTerrestreFactor(TransporteTerrestreFactor));
    } catch (error) {
        console.error("Error buscando Factor de Transporte Terrestre", error);
        return new NextResponse("Error buscando Factor de Transporte Terrestre", {status: 500});
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

        const body: TransporteTerrestreFactorRequest = await req.json();
        const TransporteTerrestreFactorRequest = {
            factor: body.factor,
            anio_id: body.anioId,
        };

        const TransporteTerrestreFactor = await prisma.factorEmisionTransporteTerrestre.update({
            where: {
                id: id,
            },
            data: TransporteTerrestreFactorRequest,
            include: {
                anio: true,
            },
        });

        return NextResponse.json({
            message: "Factor de Transporte Terrestre actualizado correctamente",
            TransporteTerrestreFactor: formatTransporteTerrestreFactor(TransporteTerrestreFactor),
        });
    } catch (error) {
        console.error("Error actualizando Factor de Transporte Terrestre", error);
        return new NextResponse("Error actualizando Factor de Transporte Terrestre", {status: 500});
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

        await prisma.factorEmisionTransporteTerrestre.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Factor de Transporte Terrestre eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Factor de Transporte Terrestre", error);
        return new NextResponse("Error eliminando Factor de Transporte Terrestre", {status: 500});
    }
}
