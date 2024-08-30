import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    CombustionCalcRequest,
    CombustionCalculosRequest
} from "@/components/combustion/services/combustionCalculate.interface";
import {formatCombustibleCalculo} from "@/lib/resources/combustionCalculateResource";
import {getAnioId} from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId");
        const tipo = searchParams.get("tipo");
        if (!sedeId) return new NextResponse("SedeId is required", {status: 400});

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        const dateFrom = searchParams.get("from") ?? undefined;
        const dateTo = searchParams.get("to") ?? undefined;
        const all = searchParams.get("all") === "true";

        let period = await prisma.periodoCalculo.findFirst({
            where: {
                fechaInicio: dateFrom ? dateFrom : undefined,
                fechaFin: dateTo ? dateTo : undefined,
            },
        });

        if (!period) {
            period = await prisma.periodoCalculo.create({
                data: {
                    fechaInicio: dateFrom ? dateFrom : undefined,
                    fechaFin: dateTo ? dateTo : undefined,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }

        if (!period && all) return new NextResponse("Periodo no encontrado", {status: 404,});

        const whereOptions = {
            sedeId: parseInt(sedeId),
            tipo: tipo ?? undefined,
            periodoCalculoId: period?.id,
            consumo: {
                not: 0
            },
        };

        const totalRecords = await prisma.combustibleCalculos.count({
            where: whereOptions
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        const combustibleCalculos = await prisma.combustibleCalculos.findMany({
            where: whereOptions,
            include: {
                tipoCombustible: true,
                sede: true,
            },
            orderBy: [{tipoCombustible: {nombre: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedCombustibleCalculos: any[] = combustibleCalculos
            .map((combustibleCalculo, index: number) => {
                combustibleCalculo.id = index + 1;
                return formatCombustibleCalculo(combustibleCalculo);
            });

        return NextResponse.json({
            data: formattedCombustibleCalculos,
            meta: {
                page,
                perPage,
                totalRecords,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Error buscando calculos", error);
        return new NextResponse("Error buscando calculos", {status: 500,});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const combustibleCalculos = [];

        const body: CombustionCalcRequest = await req.json();
        console.log(body);
        const sedeId = body.sedeId;
        const tipo = body.tipo;
        const dateFrom = body.from;
        const dateTo = body.to;

        let yearFrom, yearTo, monthFrom, monthTo;
        let yearFromId, yearToId, mesFromId, mesToId;

        if (dateFrom) [yearFrom, monthFrom] = dateFrom.split("-");
        if (dateTo) [yearTo, monthTo] = dateTo.split("-");
        if (yearFrom) yearFromId = await getAnioId(yearFrom);
        if (yearTo) yearToId = await getAnioId(yearTo);
        if (monthFrom) mesFromId = parseInt(monthFrom);
        if (monthTo) mesToId = parseInt(monthTo);

        let period = await prisma.periodoCalculo.findFirst({
            where: {
                fechaInicio: dateFrom ? dateFrom : undefined,
                fechaFin: dateTo ? dateTo : undefined,
            },
        });

        if (!period) {
            period = await prisma.periodoCalculo.create({
                data: {
                    fechaInicio: dateFrom ? dateFrom : undefined,
                    fechaFin: dateTo ? dateTo : undefined,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }

        const whereOptionsCombustion = {
            tipo: tipo,
            sede_id: sedeId,
        } as {
            tipo?: string;
            sede_id?: number;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        const from = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        console.log(from, to);

        if (from && to) {
            whereOptionsCombustion.anio_mes = {gte: from, lte: to,};
        } else if (from) {
            whereOptionsCombustion.anio_mes = {gte: from,};
        } else if (to) {
            whereOptionsCombustion.anio_mes = {lte: to,};
        }

        console.log(whereOptionsCombustion);

        const tiposCombustible = await prisma.tipoCombustible.findMany();
        const combustibles = await prisma.combustible.findMany({
            where: whereOptionsCombustion,
        });

        await prisma.combustibleCalculos.deleteMany({
            where: {
                tipo: tipo,
                sedeId: sedeId,
                periodoCalculoId: period.id,
            },
        });

        for (const tipoCombustible of tiposCombustible) {
            const totalConsumo: number = combustibles.reduce((acc, combustible) => {
                if (combustible.tipoCombustible_id === tipoCombustible.id) {
                    return acc + combustible.consumo;
                }
                return acc;
            }, 0);

            const valorCalorico = tipoCombustible.valorCalorico;
            const consumo = valorCalorico * totalConsumo;

            const totalEmisionCO2: number =
                tipoCombustible.factorEmisionCO2 * consumo;
            const totalEmisionCH4: number =
                tipoCombustible.factorEmisionCH4 * consumo;
            const totalEmisionN2O: number =
                tipoCombustible.factorEmisionN2O * consumo;
            const totalGEI: number =
                totalEmisionCO2 + totalEmisionCH4 + totalEmisionN2O;

            const calculoCombustible: CombustionCalculosRequest = {
                tipo: tipo,
                tipoCombustibleId: tipoCombustible.id,
                consumoTotal: totalConsumo,
                valorCalorico: valorCalorico,
                consumo: consumo,
                emisionCO2: totalEmisionCO2,
                emisionCH4: totalEmisionCH4,
                emisionN2O: totalEmisionN2O,
                totalGEI: totalGEI,
                periodoCalculoId: period.id,
                sedeId: sedeId,
            };

            const tipoCombustibleCreate = await prisma.combustibleCalculos.create({
                data: calculoCombustible,
                include: {
                    tipoCombustible: true,
                    sede: true,
                },
            });

            combustibleCalculos.push(tipoCombustibleCreate);
        }

        const formattedCombustibleCalculos: any[] = combustibleCalculos.map(
            (combustibleCalculo) => formatCombustibleCalculo(combustibleCalculo)
        );

        return NextResponse.json(formattedCombustibleCalculos);
    } catch (error) {
        console.error("Error calculating combustion", error);
        return new NextResponse("Error calculating combustion", {status: 500});
    }
}
