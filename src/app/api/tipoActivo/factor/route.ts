import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {ActivoFactorRequest} from "@/components/tipoActivo/services/tipoActivoFactor.interface";
import {getAnioId} from "@/lib/utils";
import {formatTipoActivoFactor} from "@/lib/resources/tipoActivoFactor";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const grupoActivoId = searchParams.get("grupoActivoId");
        const anio = searchParams.get("anioId");
        let anioId;
        if (anio) anioId = await getAnioId(anio);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const whereOptions = {
            grupoActivoId: grupoActivoId ? parseInt(grupoActivoId) : undefined,
            anioId: anioId,
        };

        console.log(whereOptions);

        const tiposActivoFactor = await prisma.factorTipoActivo.findMany({
            where: whereOptions,
            include: {anio: true, grupoActivo: true},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.factorTipoActivo.count({
                where: whereOptions,
            });
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: tiposActivoFactor.map(formatTipoActivoFactor),
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(tiposActivoFactor.map(formatTipoActivoFactor));
    } catch (error) {
        console.error("Error buscando Factores Tipos Activo", error);
        return NextResponse.json(
            {message: "Error buscando Factores Tipos Activo"},
            {status: 500}
        );
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: ActivoFactorRequest = await req.json();
        const factorTipoActivo = await prisma.factorTipoActivo.create({
            data: {
                factor: body.factor,
                grupoActivoId: body.grupoActivoId,
                anioId: body.anioId,
                fuente: body.fuente,
                link: body.link,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        return NextResponse.json({
            message: "Factor Tipo de Activo creado",
            factorActivo: factorTipoActivo,
        });
    } catch (error) {
        console.error("Error creando el Factor Tipo de Activo", error);
        return NextResponse.json(
            {message: "Error creando el Factor Tipo de Activo"},
            {status: 500}
        );
    }
}
