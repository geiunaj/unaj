import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatCombustible} from "@/lib/resources/combustionResource";
import {Combustible} from "@prisma/client";
import {CombustionRequest} from "@/components/combustion/services/combustion.interface";
import {getAnioId} from "@/lib/utils";

// INDEX
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const tipo = searchParams.get("tipo") ?? undefined;
        const tipoCombustibleId = searchParams.get("tipoCombustibleId") ?? undefined
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const anio = searchParams.get("anio") ?? undefined;
        const mesId = searchParams.get("mesId") ?? undefined;
        const sort = searchParams.get("sort") ?? undefined;
        const direction = searchParams.get("direction") ?? undefined;
        const all = searchParams.get("all") === "true";

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        const dateFrom = searchParams.get("from") ?? undefined;
        const dateTo = searchParams.get("to") ?? undefined;

        let yearFrom, yearTo, monthFrom, monthTo;
        let yearFromId, yearToId, mesFromId, mesToId;

        if (dateFrom) [yearFrom, monthFrom] = dateFrom.split("-");
        if (dateTo) [yearTo, monthTo] = dateTo.split("-");
        if (yearFrom) yearFromId = await getAnioId(yearFrom);
        if (yearTo) yearToId = await getAnioId(yearTo);
        if (monthFrom) mesFromId = parseInt(monthFrom);
        if (monthTo) mesToId = parseInt(monthTo);

        const whereOptions = {
            tipo: tipo ? tipo : undefined,
            tipoCombustible_id: tipoCombustibleId ? parseInt(tipoCombustibleId) : undefined,
            sede_id: sedeId ? parseInt(sedeId) : undefined,
            mes_id: mesId ? parseInt(mesId) : undefined,
        } as {
            tipo?: string;
            tipoCombustible_id?: number;
            sede_id?: number;
            mes_id?: number;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        const from = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        if (from && to) {
            whereOptions.anio_mes = {gte: from, lte: to,};
        } else if (from) {
            whereOptions.anio_mes = {gte: from,};
        } else if (to) {
            whereOptions.anio_mes = {lte: to,};
        }

        const totalRecords = await prisma.combustible.count({where: whereOptions});
        const totalPages = Math.ceil(totalRecords / perPage);

        const combustibles = await prisma.combustible.findMany({
            where: whereOptions,
            include: {
                tipoCombustible: true,
                mes: true,
                anio: true,
                sede: true,
            },
            orderBy: all
                ? [{anio_mes: 'asc'}]
                : sort
                    ? [{[sort]: direction || 'desc'}]
                    : [{anio_id: 'desc'}, {mes_id: 'desc'}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedCombustibles: any[] = combustibles.map(
            (combustible, index) => {
                const consumo = formatCombustible(combustible);
                consumo.rn = index + 1;
                return consumo;
            }
        );

        return NextResponse.json({
            data: formattedCombustibles,
            meta: {
                page,
                perPage,
                totalRecords,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Error buscando consumos", error);
        return new NextResponse("Error buscando consumos", {status: 500});
    }
}

// CREATE
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: CombustionRequest = await req.json();
        const anio = await prisma.anio.findFirst({
            where: {id: body.anio_id},
        });
        if (!anio) return new NextResponse("Año no encontrado", {status: 404});
        const combustible = await prisma.combustible.create({
            data: {
                tipo: body.tipo,
                tipoEquipo: body.tipoEquipo,
                consumo: body.consumo,

                sede_id: body.sede_id,
                tipoCombustible_id: body.tipoCombustible_id,
                anio_id: body.anio_id,
                mes_id: body.mes_id,
                anio_mes: Number(anio.nombre) * 100 + Number(body.mes_id),

                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                tipoCombustible: true,
                mes: true,
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Combustible regsistrado",
            combustible: formatCombustible(combustible),
        });
    } catch (error) {
        console.error("Error registrando consumo", error);
        return new NextResponse("Error registrando consumo", {status: 500});
    }
}
