import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTipoCombustible} from "@/lib/resources/tipoCombustible";
import {TipoPapelRequest} from "@/components/tipoPapel/services/tipoPapel.interface";
import {formatTipoPapel} from "@/lib/resources/tipoPapel.resource";

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
            gramaje,
            unidad_paquete,
            is_certificado,
            is_reciclable,
            porcentaje_reciclado,
            nombre_certificado
        } = body;
        if (
            (nombre && typeof nombre !== "string") ||
            (gramaje && typeof gramaje !== "number") ||
            (unidad_paquete && typeof unidad_paquete !== "string") ||
            (is_certificado && typeof is_certificado !== "boolean") ||
            (is_reciclable && typeof is_reciclable !== "boolean") ||
            (porcentaje_reciclado && typeof porcentaje_reciclado !== "number") ||
            (nombre_certificado && typeof nombre_certificado !== "string")
        ) {
            return new NextResponse("Missing or invalid required fields", {status: 404});
        }

        const tipoPapelRequest: TipoPapelRequest = {
            nombre: nombre,
            gramaje: gramaje,
            unidad_paquete: unidad_paquete,
            is_certificado: is_certificado,
            is_reciclable: is_reciclable,
            porcentaje_reciclado: is_reciclable ? porcentaje_reciclado : null,
            nombre_certificado: is_certificado ? nombre_certificado : null,
        }

        const tipoPapel = await prisma.tipoPapel.update({
            where: {
                id: id,
            },
            data: tipoPapelRequest,
        });

        return NextResponse.json({
            message: "Tipo de Papel actualizado correctamente",
            tipoPapel: formatTipoPapel(tipoPapel),
        });
    } catch (error) {
        console.error("Error actualizando tipo de papel", error);
        return new NextResponse("Error actualizando tipo de papel", {status: 500});
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
            message: "Tipo de papel eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando tipo de combustible", error);
        return new NextResponse("Error eliminando tipo de combustible", {status: 500});
    }
}
