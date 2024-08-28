import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    ElectricidadCalcRequest,
    electricidadCalculosRequest
} from "@/components/consumoElectricidad/services/electricidadCalculos.interface";
import {formatElectricidadCalculo} from "@/lib/resources/electricidadCalculateResource";
import {getAnioId} from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId");
        // const anio = searchParams.get("anio");

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        const dateFrom = searchParams.get("from") ?? undefined;
        const dateTo = searchParams.get("to") ?? undefined;
        const all = searchParams.get("all") === "true";

        const period = await prisma.periodoCalculo.findFirst({
            where: {
                fechaInicio: dateFrom ? dateFrom : undefined,
                fechaFin: dateTo ? dateTo : undefined,
            },
        });
        if (!period && all) {
            return new NextResponse("Periodo no encontrado", {status: 404,});
        }

        const whereOptions = {
            area: {
                sede_id: sedeId ? Number(sedeId) : undefined,
            },
            periodoCalculoId: period?.id,
        };

        const totalRecords = await prisma.energiaCalculos.count({
            where: whereOptions
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        const electricidadCalculos = await prisma.energiaCalculos.findMany({
            where: whereOptions,
            include: {
                area: {
                    include: {
                        sede: true
                    }
                },
            },
            orderBy: [{area: {nombre: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedElectricidadCalculos: any[] = electricidadCalculos
            .map((electricidadCalculo: any) => {
                if (electricidadCalculo.consumo !== 0) {
                    return formatElectricidadCalculo(electricidadCalculo);
                }
                return null;
            })
            .filter((combustibleCalculo) => combustibleCalculo !== null);

        return NextResponse.json({
            data: formattedElectricidadCalculos,
            meta: {
                page,
                perPage,
                totalPages,
                totalRecords,
            },
        });
    } catch (error) {
        console.error("Error buscando calculos", error);
        return new NextResponse("Error buscando calculos", {status: 500,});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: ElectricidadCalcRequest = await req.json();
        const sedeId = body.sedeId;
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

        console.log(period);

        const areas = await prisma.area.findMany({
            where: {sede_id: sedeId},
        });

        const whereOptionsConsumoElectricidad = {
            area: {sede_id: sedeId ? Number(sedeId) : undefined},
        } as {
            area: { sede_id: number };
            anio_mes?: { gte?: number; lte?: number };
        };

        const from = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        if (from && to) {
            whereOptionsConsumoElectricidad.anio_mes = {gte: from, lte: to};
        } else if (from) {
            whereOptionsConsumoElectricidad.anio_mes = {gte: from};
        } else if (to) {
            whereOptionsConsumoElectricidad.anio_mes = {lte: to};
        }

        const electricidad = await prisma.consumoEnergia.findMany({
            where: whereOptionsConsumoElectricidad
        });

        await prisma.energiaCalculos.deleteMany({
            where: {
                area: {sede_id: sedeId},
                periodoCalculoId: period.id,
            },
        });

        const consumosPorAnio: Record<number, number> = {};
        let totalEmisionCO2 = 0;
        let totalEmisionCH4 = 0;
        let totalEmisionN2O = 0;
        let totalGEI = 0;

        const factorConversion: number = 277.7778;

        for (const electricidadRecord of electricidad) {
            const anio = Math.floor(electricidadRecord.anio_mes / 100);
            if (!consumosPorAnio[anio]) {
                consumosPorAnio[anio] = 0;
            }
            consumosPorAnio[anio] += electricidadRecord.consumo;
        }

        for (const [anio, consumoAnual] of Object.entries(consumosPorAnio)) {
            const anioId = await getAnioId(anio);
            const factorSEIN = await prisma.factorConversionSEIN.findFirst({
                where: {anioId},
            });

            if (!factorSEIN) continue;

            const consumo = factorConversion * consumoAnual;
            const emisionCO2 = factorSEIN.factorCO2 * consumo;
            const emisionCH4 = factorSEIN.factorCH4 * consumo;
            const emisionN2O = factorSEIN.factorN2O * consumo;
            const totalEmisionesAnuales = emisionCO2 + emisionCH4 + emisionN2O;

            totalEmisionCO2 += emisionCO2;
            totalEmisionCH4 += emisionCH4;
            totalEmisionN2O += emisionN2O;
            totalGEI += totalEmisionesAnuales;
        }

        for (const area of areas) {
            const calculoElectricidad: electricidadCalculosRequest = {
                areaId: area.id,
                consumoTotal: Object.values(consumosPorAnio).reduce((acc, curr) => acc + curr, 0),
                factorConversion: factorConversion,
                consumo: factorConversion * Object.values(consumosPorAnio).reduce((acc, curr) => acc + curr, 0),
                emisionCO2: totalEmisionCO2,
                emisionCH4: totalEmisionCH4,
                emisionN2O: totalEmisionN2O,
                totalGEI: totalGEI,
            };

            await prisma.energiaCalculos.create({
                data: {
                    consumoArea: calculoElectricidad.consumo,
                    factorConversion: calculoElectricidad.factorConversion,
                    consumoTotal: calculoElectricidad.consumoTotal,
                    emisionCO2: calculoElectricidad.emisionCO2,
                    emisionCH4: calculoElectricidad.emisionCH4,
                    emisionN2O: calculoElectricidad.emisionN2O,
                    totalGEI: calculoElectricidad.totalGEI,
                    areaId: calculoElectricidad.areaId,
                    periodoCalculoId: period.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculating combustion", error);
        return new NextResponse("Error calculating combustion", {status: 500});
    }
}


