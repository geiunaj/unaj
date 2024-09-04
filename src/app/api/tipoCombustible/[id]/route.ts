import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTipoCombustible} from "@/lib/resources/tipoCombustible";
import {TipoCombustibleRequest} from "@/components/tipoCombustible/services/tipoCombustible.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    console.log(params.id);
    try {
        const id = parseInt(params.id);
        const tipoCombustible = await prisma.tipoCombustible.findUnique({
            where: {
                id: id,
            },
        });

        if (!tipoCombustible) {
            return new NextResponse("Tipo Combustible not found", {status: 404});
        }

        return NextResponse.json(formatTipoCombustible(tipoCombustible));
    } catch (error) {
        console.error("Error finding tipo combustible", error);
        return new NextResponse("Error finding tipo combustible", {status: 500});
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
            abreviatura,
            unidad,
        }: TipoCombustibleRequest = body;
        if (
            (nombre && typeof nombre !== "string") ||
            (abreviatura && typeof abreviatura !== "string") ||
            (unidad && typeof unidad !== "string")
        ) {
            return new NextResponse("Missing or invalid required fields", {status: 404});
        }

        const tipoCombustibleRequest: TipoCombustibleRequest = {
            nombre: nombre,
            abreviatura: abreviatura,
            unidad: unidad,
        }

        const tipoCombustible = await prisma.tipoCombustible.update({
            where: {
                id: id,
            },
            data: tipoCombustibleRequest,
        });

        return NextResponse.json({
            message: "Tipo de Combustible actualizado correctamente",
            tipoCombustible: formatTipoCombustible(tipoCombustible),
        });
    } catch (error) {
        console.error("Error actualizando tipo de combustible", error);
        return new NextResponse("Error actualizando tipo de combustible", {status: 500});
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

        await prisma.tipoCombustible.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Tipo de Combustible eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Tipo de Combustible", error);
        return new NextResponse("Error eliminando Tipo de Combustible", {status: 500});
    }
}
