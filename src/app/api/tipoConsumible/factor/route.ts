import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {ConsumibleFactorRequest} from "@/components/tipoConsumible/services/tipoConsumibleFactor.interface";
import {formatTipoConsumibleFactor} from "@/lib/resources/tipoConsumibleFactor";
import {getAnioId} from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const tipoConsumibleId = searchParams.get("tipoConsumibleId");
        const anio = searchParams.get("anioId");
        let anioId;
        if (anio) anioId = await getAnioId(anio);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const whereOptions = {
            tipoConsumibleId: tipoConsumibleId ? parseInt(tipoConsumibleId) : undefined,
            anioId: anioId,
        };

        console.log(whereOptions);

        const tiposConsumibleFactor = await prisma.factorTipoConsumible.findMany({
            where: whereOptions,
            include: {anio: true, tipoConsumible: true},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.factorTipoConsumible.count({where: whereOptions});
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: tiposConsumibleFactor.map(formatTipoConsumibleFactor),
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(tiposConsumibleFactor.map(formatTipoConsumibleFactor));
    } catch (error) {
        console.error("Error buscando Factores Tipos Consumible", error);
        return new NextResponse("Error buscando Factores Tipos Consumible", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: ConsumibleFactorRequest = await req.json();
        const factorTipoConsumible = await prisma.factorTipoConsumible.create({
            data: {
                factor: body.factor,
                tipoConsumibleId: body.tipoConsumibleId,
                anioId: body.anioId,
                fuente: body.fuente,
                link: body.link,
                created_at: new Date(),
                updated_at: new Date(),
            },

        });
        return NextResponse.json({
            message: "Factor Tipo de Consumible creado",
            tipoPapel: factorTipoConsumible,
        });

    } catch (error) {
        console.error("Error creando el Factor Tipo de Consumible", error);
        return new NextResponse("Error creando el Factor Tipo de Consumible", {status: 500});
    }
}