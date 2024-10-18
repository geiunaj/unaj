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
        const TransporteAereoFactor = await prisma.factorEmisionTransporteAereo.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
            },
        });

        if (!TransporteAereoFactor) {
            return new NextResponse("Factor de Transporte Aereo no encontrado", {status: 404});
        }

        return NextResponse.json(formatTransporteAereoFactor(TransporteAereoFactor));
    } catch (error) {
        console.error("Error buscando Factor de Transporte Aereo", error);
        return new NextResponse("Error buscando Factor de Transporte Aereo", {status: 500});
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

        const body: TransporteAereoFactorRequest = await req.json();
        const TransporteAereoFactorRequest = {
            factor1600: body.factor1600,
            factor1600_3700: body.factor1600_3700,
            factor3700: body.factor3700,
            anio_id: body.anioId,
        };

        const TransporteAereoFactor = await prisma.factorEmisionTransporteAereo.update({
            where: {
                id: id,
            },
            data: TransporteAereoFactorRequest,
            include: {
                anio: true,
            },
        });

        return NextResponse.json({
            message: "Factor de Transporte Aereo actualizado correctamente",
            TransporteAereoFactor: formatTransporteAereoFactor(TransporteAereoFactor),
        });
    } catch (error) {
        console.error("Error actualizando Factor de Transporte Aereo", error);
        return new NextResponse("Error actualizando Factor de Transporte Aereo", {status: 500});
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

        await prisma.factorEmisionTransporteAereo.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Factor de Transporte Aereo eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Factor de Transporte Aereo", error);
        return new NextResponse("Error eliminando Factor de Transporte Aereo", {status: 500});
    }
}
