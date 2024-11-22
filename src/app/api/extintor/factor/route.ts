import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    ExtintorFactorRequest
} from "@/components/extintorFactor/services/extintorFactor.interface";
import {formatExtintorFactor} from "@/lib/resources/extintorFactor.resource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const anioId = searchParams.get("anioId");
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const whereOptions = anioId ? {anio_id: parseInt(anioId)} : {};
        const factoresTransporte = await prisma.factorEmisionExtintor.findMany({
            where: whereOptions,
            include: {anio: true},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.factorEmisionExtintor.count({where: whereOptions});
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: factoresTransporte.map(formatExtintorFactor),
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(factoresTransporte.map(formatExtintorFactor));
    } catch (error) {
        console.error("Error buscando Factores de Extintor", error);
        return NextResponse.json({message: "Error buscando Factores de Extintor"}, {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: ExtintorFactorRequest = await req.json();
        const factorExistente = await prisma.factorEmisionExtintor.findFirst({
            where: {
                anio_id: body.anioId,
            },
        });
        if (factorExistente) {
            return NextResponse.json({message: "Ya existe un factor de Extintor para este año"}, {status: 400});
        }
        const factorEmisionExtintor = await prisma.factorEmisionExtintor.create({
            data: {
                factor: body.factor,
                anio_id: body.anioId,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Factor De Extintor Creado",
            factorEmisionExtintor,
        });

    } catch (error) {
        console.error("Error creando el Factor de Extintor SEIN", error);
        return NextResponse.json({message: "Error creando el Factor de Extintor SEIN"}, {status: 500});
    }
}
