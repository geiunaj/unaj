import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTipoConsumibleFactor} from "@/lib/resources/tipoConsumibleFactor";
import {ConsumibleFactorRequest} from "@/components/tipoConsumible/services/tipoConsumibleFactor.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const factorTipoConsumible = await prisma.factorTipoConsumible.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
                tipoConsumible: true
            }
        });

        if (!factorTipoConsumible) {
            return new NextResponse("Tipo Consumible Factor not found", {status: 404});
        }

        return NextResponse.json(formatTipoConsumibleFactor(factorTipoConsumible));
    } catch (error) {
        console.error("Error finding tipo consumible factor", error);
        return new NextResponse("Error finding tipo consumible factor", {status: 500});
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
        const body: ConsumibleFactorRequest = await req.json();
        const factorTipoConsumible = await prisma.factorTipoConsumible.update({
            where: {
                id: id,
            },
            data: {
                factor: body.factor,
                tipoConsumibleId: body.tipoConsumibleId,
                anioId: body.anioId,
                fuente: body.fuente,
                link: body.link,
                updated_at: new Date(),
            },
            include: {
                anio: true,
                tipoConsumible: true
            }
        });

        return NextResponse.json({
            message: "Factor Tipo de Consumible actualizado",
            factorTipoConsumible: formatTipoConsumibleFactor(factorTipoConsumible),
        });
    } catch (error) {
        console.error("Error actualizando Factor de Tipo de Consumible", error);
        return new NextResponse("Error ctualizando Factor de Tipo de Consumible", {status: 500});
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

        await prisma.factorTipoConsumible.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Factor de Tipo de Consumible eliminado",
        });
    } catch (error: any) {
        console.error("Error eliminando Factor de Tipo de Consumible", error);
        return new NextResponse("Error eliminando Factor de Tipo de Consumible", {status: 500});
    }
}
