import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatfactorEmisionSEIN} from "@/lib/resources/factorEmisionSEIN.Resource";
import {
    TransporteAereoFactorRequest
} from "@/components/transporte-aereo-factor/services/transporteAereoFactor.interface";
import {formatTransporteAereoFactor} from "@/lib/resources/transporteAereoFactor.resource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const anioId = searchParams.get("anioId");
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const whereOptions = anioId ? {anio_id: parseInt(anioId)} : {};
        const factoresTransporte = await prisma.factorEmisionTransporteAereo.findMany({
            where: whereOptions,
            include: {anio: true},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.factorEmisionTransporteAereo.count({where: whereOptions});
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: factoresTransporte.map(formatTransporteAereoFactor),
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(factoresTransporte.map(formatTransporteAereoFactor));
    } catch (error) {
        console.error("Error buscando Factores de Transporte Aereo", error);
        return new NextResponse("Error buscando Factores de Transporte Aereo", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TransporteAereoFactorRequest = await req.json();
        const factorExistente = await prisma.factorEmisionTransporteAereo.findFirst({
            where: {
                anio_id: body.anioId,
            },
        });
        if (factorExistente) {
            return new NextResponse("Ya existe un factor de Transporte Aereo para este año", {status: 400});
        }
        const factorEmisionTransporteAereo = await prisma.factorEmisionTransporteAereo.create({
            data: {
                factor1600: body.factor1600,
                factor1600_3700: body.factor1600_3700,
                factor3700: body.factor3700,
                anio_id: body.anioId,
                fuente: body.fuente,
                link: body.link,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Factor De Transporte Aereo Creado",
            factorEmisionTransporteAereo,
        });

    } catch (error) {
        console.error("Error creando el Factor de Transporte Aereo SEIN", error);
        return new NextResponse("Error creando el Factor de Transporte Aereo SEIN", {status: 500});
    }
}
