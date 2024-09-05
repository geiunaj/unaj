import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FactorEmisionSEINRequest } from "@/components/factorEmisionSEIN/services/factorEmisionSEIN.interface";
import { formatfactorEmisionSEIN } from "@/lib/resources/factorEmisionSEIN.Resource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const anioId = searchParams.get("anioId");
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const whereOptions = anioId ? { anioId: parseInt(anioId) } : {};
        const factoresConversionSEIN = await prisma.factorConversionSEIN.findMany({
            where: whereOptions,
            include: { anio: true },
            ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.factorConversionSEIN.count({ where: whereOptions });
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: factoresConversionSEIN.map(formatfactorEmisionSEIN),
                meta: { page, perPage, totalRecords, totalPages },
            });
        }

        return NextResponse.json(factoresConversionSEIN.map(formatfactorEmisionSEIN));
    } catch (error) {
        console.error("Error buscando Factores de Conversión SEIN", error);
        return new NextResponse("Error buscando Factores de Conversión SEIN", { status: 500 });
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: FactorEmisionSEINRequest = await req.json();
        const factorConversionSEIN = await prisma.factorConversionSEIN.create({
            data: {
                factorCO2: body.factorCO2,
                factorCH4: body.factorCH4,
                factorN2O: body.factorN2O,
                anioId: body.anioId,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Factor de Conversión SEIN creado",
            factorConversionSEIN,
        });

    } catch (error) {
        console.error("Error creando el Factor de Conversión SEIN", error);
        return new NextResponse("Error creando el Factor de Conversión SEIN", { status: 500 });
    }
}
