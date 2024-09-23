import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import { formatfactorEmisionSEIN } from "@/lib/resources/factorEmisionSEIN.Resource";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const factorEmisionSEIN = await prisma.factorConversionSEIN.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true, // Incluye la relación para obtener el nombre del año
            },
        });

        if (!factorEmisionSEIN) {
            return new NextResponse("Factor de emisión SEIN no encontrado", {status: 404});
        }

        return NextResponse.json(formatfactorEmisionSEIN(factorEmisionSEIN));
    } catch (error) {
        console.error("Error buscando factor de emisión SEIN", error);
        return new NextResponse("Error buscando factor de emisión SEIN", {status: 500});
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
        const {
            factorCO2,
            factorCH4,
            factorN2O,
            anioId,
        } = body;

        if (
            (factorCO2 && typeof factorCO2 !== "number") ||
            (factorCH4 && typeof factorCH4 !== "number") ||
            (factorN2O && typeof factorN2O !== "number") ||
            (anioId && typeof anioId !== "number")
        ) {
            return new NextResponse("Faltan o son inválidos los campos requeridos", {status: 400});
        }

        const factorEmisionSEINRequest = {
            factorCO2,
            factorCH4,
            factorN2O,
            anioId,
        };

        const factorEmisionSEIN = await prisma.factorConversionSEIN.update({
            where: {
                id: id,
            },
            data: factorEmisionSEINRequest,
            include: {
                anio: true, 
            },
        });

        return NextResponse.json({
            message: "Factor de emisión SEIN actualizado correctamente",
            factorEmisionSEIN: formatfactorEmisionSEIN(factorEmisionSEIN),
        });
    } catch (error) {
        console.error("Error actualizando factor de emisión SEIN", error);
        return new NextResponse("Error actualizando factor de emisión SEIN", {status: 500});
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

        await prisma.factorConversionSEIN.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Factor de emisión SEIN eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando factor de emisión SEIN", error);
        return new NextResponse("Error eliminando factor de emisión SEIN", {status: 500});
    }
}
