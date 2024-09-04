import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTipoCombustibleFactor} from "@/lib/resources/tipoCombustibleFactor";
import {TipoCombustibleFactorRequest} from "@/components/tipoCombustible/services/tipoCombustibleFactor.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const tipoCombustibleId = searchParams.get("tipoCombustibleId");
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const whereOptions = tipoCombustibleId ? {tipoCombustible_id: parseInt(tipoCombustibleId)} : {};
        const tiposCombustibleFactor = await prisma.tipoCombustibleFactor.findMany({
            where: whereOptions,
            include: {anio: true, tipoCombustible: true},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.tipoCombustibleFactor.count({where: whereOptions});
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: tiposCombustibleFactor.map(formatTipoCombustibleFactor),
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(tiposCombustibleFactor.map(formatTipoCombustibleFactor));
    } catch (error) {
        console.error("Error buscando Factores de Tipos Combustible", error);
        return new NextResponse("Error buscando Factores de Tipos Combustible", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TipoCombustibleFactorRequest = await req.json();
        const factorTipoCombustible = await prisma.tipoCombustibleFactor.create({
            data: {
                tipoCombustible_id: body.tipoCombustible_id,
                valorCalorico: body.valorCalorico,
                factorEmisionCO2: body.factorEmisionCO2,
                factorEmisionCH4: body.factorEmisionCH4,
                factorEmisionN2O: body.factorEmisionN2O,
                anio_id: body.anio_id,
                created_at: new Date(),
                updated_at: new Date(),
            },

        });
        return NextResponse.json({
            message: "Factor del Tipo de Combustible creado",
            tipoPapel: factorTipoCombustible,
        });

    } catch (error) {
        console.error("Error creando el Factor del Tipo de Combustible", error);
        return new NextResponse("Error creando el Factor del Tipo de Combustible", {status: 500});
    }
}