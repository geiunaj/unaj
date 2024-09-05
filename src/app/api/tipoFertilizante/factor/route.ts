import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatTipoCombustibleFactor } from "@/lib/resources/tipoCombustibleFactor";
import {FertilizanteFactorRequest } from "@/components/tipoFertilizante/services/tipoFertilizanteFactor.interface";
import { formatFactorEmisionFertilizante } from "@/lib/resources/factorEmisionFertilizante";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        // Consulta los factores de emisión de fertilizantes
        const factoresEmisionFertilizante = await prisma.factorEmisionFertilizante.findMany({
            include: { anio: true },
            ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.factorEmisionFertilizante.count();
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: factoresEmisionFertilizante.map(formatFactorEmisionFertilizante),
                meta: { page, perPage, totalRecords, totalPages },
            });
        }

        return NextResponse.json(factoresEmisionFertilizante.map(formatFactorEmisionFertilizante));
    } catch (error) {
        console.error("Error buscando Factores de Emisión del Fertilizante", error);
        return new NextResponse("Error buscando Factores de Emisión del Fertilizante", { status: 500 });
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: FertilizanteFactorRequest = await req.json();
        const factorEmisionFertilizante = await prisma.factorEmisionFertilizante.create({
            data: {
                valor: body.valor,
                anio_id: body.anio_id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Factor de Emisión del Fertilizante creado",
            factorEmisionFertilizante,
        });
    } catch (error) {
        console.error("Error creando el Factor de Emisión del Fertilizante", error);
        return new NextResponse("Error creando el Factor de Emisión del Fertilizante", { status: 500 });
    }
}
