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
                // anio: true,
                factor: true,
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
        const electricidadCalculos = [];

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

        const areas = await prisma.area.findMany(
            {
                where: {
                    sede_id: sedeId,
                },
            }
        );

        const whereOptionsConsumoElectricidad = {
            area: {sede_id: sedeId ? Number(sedeId) : undefined,},
        } as{
            area:{
                sede_id: number;
            }
            anio_mes?: {
                gte?: number;
                lte?: number;
            }
        }
        const from = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        if (from && to) {
            whereOptionsConsumoElectricidad.anio_mes = {gte: from, lte: to,};
        } else if (from) {
            whereOptionsConsumoElectricidad.anio_mes = {gte: from,};
        } else if (to) {
            whereOptionsConsumoElectricidad.anio_mes = {lte: to,};
        }

        const electricidad = await prisma.consumoEnergia.findMany({
            where: whereOptionsConsumoElectricidad
        });

        await prisma.energiaCalculos.deleteMany({
            where: {
                area: {sede_id: sedeId,},
                periodoCalculoId: period.id,
            },
        });

        const factorSEIN = await prisma.factorConversionSEIN.findFirst({
            
            where: {
                anioId: anioId,
            },
        });

        if (!factorSEIN) return NextResponse.json([{error: "Factor SEIN not found"}]);

        const factorConversion: number = 277.7778;

        for (const area of areas) {
            const totalConsumo: number = electricidad.reduce((acc, electricidad) => {
                if (electricidad.areaId === area.id) {
                    return acc + electricidad.consumo;
                }
                return acc;
            }, 0);
            const consumo = factorConversion * totalConsumo;
            const totalEmisionCO2: number =
                factorSEIN.factorCO2 * consumo;
            const totalEmisionCH4: number =
                factorSEIN.factorCH4 * consumo;
            const totalEmisionN2O: number =
                factorSEIN.factorN2O * consumo;
            const totalGEI: number =
                totalEmisionCO2 + totalEmisionCH4 + totalEmisionN2O;
            const calculoElectricidad: electricidadCalculosRequest = {
                areaId: area.id,
                consumoTotal: totalConsumo,
                factorConversion: factorConversion,
                consumo: consumo,
                emisionCO2: totalEmisionCO2,
                emisionCH4: totalEmisionCH4,
                emisionN2O: totalEmisionN2O,
                totalGEI: totalGEI,
                anioId: anioId,
            };
            const electridadCalculoCreate = await prisma.energiaCalculos.create({
                data: {
                    consumoArea: calculoElectricidad.consumo,
                    factorConversion: calculoElectricidad.factorConversion,
                    factorId: factorSEIN.id,
                    consumoTotal: calculoElectricidad.consumoTotal,
                    emisionCO2: calculoElectricidad.emisionCO2,
                    emisionCH4: calculoElectricidad.emisionCH4,
                    emisionN2O: calculoElectricidad.emisionN2O,
                    totalGEI: calculoElectricidad.totalGEI,
                    areaId: calculoElectricidad.areaId,
                    anioId: calculoElectricidad.anioId,

                    created_at: new Date(),
                    updated_at: new Date(),
                },
                include: {
                    area: {include: {sede: true,}},
                    anio: true,
                    factor: true
                },
            });

            electricidadCalculos.push(electridadCalculoCreate);
        }

        const formattedElectricidadCalculos: any[] = electricidadCalculos.map(formatElectricidadCalculo);
        return NextResponse.json(formattedElectricidadCalculos);
    } catch (error) {
        console.error("Error calculating combustion", error);
        return new NextResponse("Error calculating combustion", {status: 500});
    }
}
