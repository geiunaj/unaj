import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatfactorEmisionSEIN} from "@/lib/resources/factorEmisionSEIN.Resource";
import {
    TransporteTerrestreFactorRequest
} from "@/components/transporte-terrestre-factor/services/transporteTerrestreFactor.interface";
import {formatTransporteTerrestreFactor} from "@/lib/resources/transporteTerrestreFactor.resource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const anioId = searchParams.get("anioId");
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const whereOptions = anioId ? {anio_id: parseInt(anioId)} : {};
        const factoresTransporte = await prisma.factorEmisionTransporteTerrestre.findMany({
            where: whereOptions,
            include: {anio: true},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.factorEmisionTransporteTerrestre.count({where: whereOptions});
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: factoresTransporte.map(formatTransporteTerrestreFactor),
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(factoresTransporte.map(formatTransporteTerrestreFactor));
    } catch (error) {
        console.error("Error buscando Factores de Transporte Terrestre", error);
        return new NextResponse("Error buscando Factores de Transporte Terrestre", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TransporteTerrestreFactorRequest = await req.json();
        const factorExistente = await prisma.factorEmisionTransporteTerrestre.findFirst({
            where: {
                anio_id: body.anioId,
            },
        });
        if (factorExistente) {
            return new NextResponse("Ya existe un factor de Transporte Terrestre para este año", {status: 400});
        }
        const factorEmisionTransporteTerrestre = await prisma.factorEmisionTransporteTerrestre.create({
            data: {
                factor: body.factor,
                anio_id: body.anioId,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Factor De Transporte Terrestre Creado",
            factorEmisionTransporteTerrestre,
        });

    } catch (error) {
        console.error("Error creando el Factor de Transporte Terrestre SEIN", error);
        return new NextResponse("Error creando el Factor de Transporte Terrestre SEIN", {status: 500});
    }
}
