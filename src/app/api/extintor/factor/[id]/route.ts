import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatExtintorFactor} from "@/lib/resources/extintorFactor.resource";
import {
    ExtintorFactorRequest
} from "@/components/extintorFactor/services/extintorFactor.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const ExtintorFactor = await prisma.factorEmisionExtintor.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
            },
        });

        if (!ExtintorFactor) {
            return NextResponse.json({message: "Factor de Extintor no encontrado"}, {status: 404});
        }

        return NextResponse.json(formatExtintorFactor(ExtintorFactor));
    } catch (error) {
        console.error("Error buscando Factor de Extintor", error);
        return NextResponse.json({message: "Error buscando Factor de Extintor"}, {status: 500});
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({message: "ID inválido"}, {status: 400});
        }

        const body: ExtintorFactorRequest = await req.json();
        const ExtintorFactorRequest = {
            factor: body.factor,
            anio_id: body.anioId,
        };

        const ExtintorFactor = await prisma.factorEmisionExtintor.update({
            where: {
                id: id,
            },
            data: ExtintorFactorRequest,
            include: {
                anio: true,
            },
        });

        return NextResponse.json({
            message: "Factor de Extintor actualizado correctamente",
            ExtintorFactor: formatExtintorFactor(ExtintorFactor),
        });
    } catch (error) {
        console.error("Error actualizando Factor de Extintor", error);
        return NextResponse.json({message: "Error actualizando Factor de Extintor"}, {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({message: "ID inválido"}, {status: 400});
        }

        await prisma.factorEmisionExtintor.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Factor de Extintor eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Factor de Extintor", error);
        return NextResponse.json({message: "Error eliminando Factor de Extintor"}, {status: 500});
    }
}
