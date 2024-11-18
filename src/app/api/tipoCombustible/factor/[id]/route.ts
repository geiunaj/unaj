import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTipoCombustibleFactor} from "@/lib/resources/tipoCombustibleFactor";
import {TipoCombustibleFactorRequest} from "@/components/tipoCombustible/services/tipoCombustibleFactor.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const tipoCombustibleFactor = await prisma.tipoCombustibleFactor.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
                tipoCombustible: true
            }
        });

        if (!tipoCombustibleFactor) {
            return new NextResponse("Tipo Combustible Factor not found", {status: 404});
        }

        return NextResponse.json(formatTipoCombustibleFactor(tipoCombustibleFactor));
    } catch (error) {
        console.error("Error finding tipo combustible factor", error);
        return new NextResponse("Error finding tipo combustible factor", {status: 500});
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
        const body: TipoCombustibleFactorRequest = await req.json();
        const tipoCombustibleFactor = await prisma.tipoCombustibleFactor.update({
            where: {
                id: id,
            },
            data: {
                tipoCombustible_id: body.tipoCombustible_id,
                valorCalorico: body.valorCalorico,
                factorEmisionCO2: body.factorEmisionCO2,
                factorEmisionCH4: body.factorEmisionCH4,
                factorEmisionN2O: body.factorEmisionN2O,
                anio_id: body.anio_id,
                updated_at: new Date(),
            },
            include: {
                anio: true,
                tipoCombustible: true
            },
        });

        return NextResponse.json({
            message: "Factor Tipo de Combustible actualizado",
            tipoCombustibleFactor: formatTipoCombustibleFactor(tipoCombustibleFactor),
        });
    } catch (error) {
        console.error("Error actualizando Factor de Tipo de Combustible", error);
        return new NextResponse("Error ctualizando Factor de Tipo de Combustible", {status: 500});
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

        await prisma.tipoCombustibleFactor.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Factor de Tipo de Combustible eliminado",
        });
    } catch (error: any) {
        console.error("Error eliminando Factor de Tipo de Combustible", error);
        return new NextResponse("Error eliminando Factor de Tipo de Combustible", {status: 500});
    }
}
