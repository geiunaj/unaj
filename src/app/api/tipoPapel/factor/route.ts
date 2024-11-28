import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";
import {formatTipoPapelFactor} from "@/lib/resources/tipoPapelFactor";
import {PapelFactorRequest} from "@/components/tipoPapel/services/tipoPapelFactor.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const tipoPapelId = searchParams.get("tipoPapelId");
        const anio = searchParams.get("anioId");
        let anioId;
        if (anio) anioId = await getAnioId(anio);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const whereOptions = {
            tipoPapelId: tipoPapelId ? parseInt(tipoPapelId) : undefined,
            anioId: anioId,
        };

        const tiposPapelFactor = await prisma.factorTipoPapel.findMany({
            where: whereOptions,
            include: {anio: true, tipoPapel: true},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
            orderBy: {tipoPapel: {nombre: "asc"}},
        });

        if (perPage > 0) {
            const totalRecords = await prisma.factorTipoPapel.count({
                where: whereOptions,
            });
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: tiposPapelFactor.map(formatTipoPapelFactor),
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(tiposPapelFactor.map(formatTipoPapelFactor));
    } catch (error) {
        console.error("Error buscando Factores Tipos Papel", error);
        return NextResponse.json(
            {message: "Error buscando Factores Tipos Papel"},
            {status: 500}
        );
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: PapelFactorRequest = await req.json();
        const factorTipoPapel = await prisma.factorTipoPapel.create({
            data: {
                factor: body.factor,
                tipoPapelId: body.tipoPapelId,
                anioId: body.anioId,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        return NextResponse.json({
            message: "Factor Tipo de Papel creado",
            factorPapel: factorTipoPapel,
        });
    } catch (error) {
        console.error("Error creando el Factor Tipo de Papel", error);
        return NextResponse.json(
            {message: "Error creando el Factor Tipo de Papel"},
            {status: 500}
        );
    }
}
