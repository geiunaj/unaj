import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {FertilizanteFactorRequest} from "@/components/tipoFertilizante/services/tipoFertilizanteFactor.interface";
import {formatFactorEmisionFertilizante} from "@/lib/resources/factorEmisionFertilizante";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const factorFertilizante = await prisma.factorEmisionFertilizante.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
                tipoFertilizante: true,
            },
        });

        if (!factorFertilizante) {
            return NextResponse.json(
                {message: "Factor Tipo Fertilizante no encontrado"},
                {status: 404}
            );
        }

        return NextResponse.json(formatFactorEmisionFertilizante(factorFertilizante));
    } catch (error) {
        console.error("Error finding Factor Tipo Fertilizante", error);
        return NextResponse.json(
            {message: "Error buscando factor"},
            {status: 500}
        );
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({message: "Invalid ID"}, {status: 400});
        }
        const factor = await prisma.factorEmisionFertilizante.findUnique({where: {id}});
        if (!factor)
            return NextResponse.json(
                {message: "Factor Tipo de Activo no encontrado"},
                {status: 404}
            );
        const body: FertilizanteFactorRequest = await req.json();
        const factorFertilizante = await prisma.factorEmisionFertilizante.update({
            where: {
                id: id,
            },
            include: {
                anio: true,
                tipoFertilizante: true,
            },
            data: {
                valor: body.valor,
                anio_id: body.anio_id,
                tipoFertilizanteId: body.tipoFertilizanteId,
                link: body.link,
                fuente: body.fuente,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Factor Tipo de Activo actualizado",
            factorFertilizante: formatFactorEmisionFertilizante(factorFertilizante),
        });
    } catch (error) {
        console.error("Error actualizando Factor de Fertilizante", error);
        return NextResponse.json(
            {message: "Error actualizando Factor"},
            {status: 500}
        );
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

        await prisma.factorEmisionFertilizante.delete({
            where: {id},
        });

        return NextResponse.json({message: "Factor de Tipo de Activo eliminado"});
    } catch (error: any) {
        console.error("Error eliminando Factor de Tipo de Fertilizante", error);
        return NextResponse.json(
            {message: "Error eliminando Factor de Tipo de Fertilizante"},
            {status: 500}
        );
    }
}
