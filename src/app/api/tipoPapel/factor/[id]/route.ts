import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTipoPapelFactor} from "@/lib/resources/tipoPapelFactor";
import {PapelFactorRequest} from "@/components/tipoPapel/services/tipoPapelFactor.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const factorTipoPapel = await prisma.factorTipoPapel.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
                tipoPapel: true,
            },
        });

        if (!factorTipoPapel) {
            return NextResponse.json(
                {message: "Tipo Papel Factor no encontrado"},
                {status: 404}
            );
        }

        return NextResponse.json(formatTipoPapelFactor(factorTipoPapel));
    } catch (error) {
        console.error("Error finding tipo combustible factor", error);
        return NextResponse.json(
            {message: "Error finding tipo combustible factor"},
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
        const factor = await prisma.factorTipoPapel.findUnique({where: {id}});
        if (!factor)
            return NextResponse.json(
                {message: "Factor Tipo de Papel no encontrado"},
                {status: 404}
            );
        const body: PapelFactorRequest = await req.json();
        const factorTipoPapel = await prisma.factorTipoPapel.update({
            where: {
                id: id,
            },
            include: {
                anio: true,
                tipoPapel: true,
            },
            data: {
                factor: body.factor,
                tipoPapelId: body.tipoPapelId,
                anioId: body.anioId,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Factor Tipo de Papel actualizado",
            factorTipoPapel: formatTipoPapelFactor(factorTipoPapel),
        });
    } catch (error) {
        console.error("Error actualizando Factor de Tipo de Papel", error);
        return NextResponse.json(
            {message: "Error actualizando Factor de Tipo de Papel"},
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

        await prisma.factorTipoPapel.delete({
            where: {id},
        });

        return NextResponse.json({message: "Factor de Tipo de Papel eliminado"});
    } catch (error: any) {
        console.error("Error eliminando Factor de Tipo de Papel", error);
        return NextResponse.json(
            {message: "Error eliminando Factor de Tipo de Papel"},
            {status: 500}
        );
    }
}
