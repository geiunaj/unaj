import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {ElectricidadCalcRequest} from "@/components/consumoElectricidad/services/electricidadCalculos.interface";
import {formatElectricidadCalculo} from "@/lib/resources/electricidadCalculateResource";
import {getAnioId} from "@/lib/utils";
import {WhereAnioMes} from "@/lib/interfaces/globals";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId");

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        const dateFrom = searchParams.get("from") ?? undefined;
        const dateTo = searchParams.get("to") ?? undefined;
        const all = searchParams.get("all") === "true";

        let yearFrom, yearTo, monthFrom, monthTo;
        let yearFromId, yearToId, mesFromId, mesToId;

        if (dateFrom) [yearFrom, monthFrom] = dateFrom.split("-");
        if (dateTo) [yearTo, monthTo] = dateTo.split("-");
        if (yearFrom) yearFromId = await getAnioId(yearFrom);
        if (yearTo) yearToId = await getAnioId(yearTo);
        if (monthFrom) mesFromId = parseInt(monthFrom);
        if (monthTo) mesToId = parseInt(monthTo);

        const fromValue = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const toValue = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        let period = await prisma.periodoCalculo.findFirst({
            where: {
                fechaInicio: dateFrom ? dateFrom : undefined,
                fechaFin: dateTo ? dateTo : undefined,
                fechaInicioValue: fromValue,
                fechaFinValue: toValue,
            },
        });

        if (!period) {
            period = await prisma.periodoCalculo.create({
                data: {
                    fechaInicio: dateFrom ? dateFrom : undefined,
                    fechaFin: dateTo ? dateTo : undefined,
                    fechaInicioValue: fromValue,
                    fechaFinValue: toValue,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }

        if (!period && all) return NextResponse.json({message: "Periodo no encontrado"}, {status: 404,});

        const whereOptions = {
            area: {
                sede_id: sedeId ? Number(sedeId) : undefined,
            },
            periodoCalculoId: period?.id,
            totalGEI: {
                not: 0
            },
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
                EnergiaCalculosDetail: true
            },
            orderBy: [{area: {nombre: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedElectricidadCalculos: any[] = electricidadCalculos
            .map((electricidadCalculo: any, index: number) => {
                if (electricidadCalculo.consumoArea !== 0) {
                    const consumo = formatElectricidadCalculo(electricidadCalculo)
                    consumo.rn = index + 1 + (page - 1) * perPage;
                    return consumo;
                }
                return null;
            })
            .filter((electricidadCalculo) => electricidadCalculo !== null);

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
        return NextResponse.json({message: "Error buscando calculos"}, {status: 500,});
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

        const fromValue = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const toValue = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        let period = await prisma.periodoCalculo.findFirst({
            where: {
                fechaInicio: dateFrom ? dateFrom : undefined,
                fechaFin: dateTo ? dateTo : undefined,
                fechaInicioValue: fromValue,
                fechaFinValue: toValue,
            },
        });

        if (!period) {
            period = await prisma.periodoCalculo.create({
                data: {
                    fechaInicio: dateFrom ? dateFrom : undefined,
                    fechaFin: dateTo ? dateTo : undefined,
                    fechaInicioValue: fromValue,
                    fechaFinValue: toValue,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }

        const areas = await prisma.area.findMany({
            where: {sede_id: sedeId},
        });

        const whereOptionsConsumoElectricidad = {
            area: {sede_id: sedeId ? Number(sedeId) : undefined},
        } as {
            areaId?: number;
            area: { sede_id: number };
            anio_mes?: { gte?: number; lte?: number };
        };

        await prisma.energiaCalculosDetail.deleteMany({
            where: {
                EnergiaCalculos: {
                    periodoCalculoId: period.id,
                }
            },
        });

        await prisma.energiaCalculos.deleteMany({
            where: {
                area: {sede_id: sedeId ? Number(sedeId) : undefined,},
                periodoCalculoId: period.id,
            },
        });

        const factorConversion: number = 277.7778;
        const allPeriodsBetweenYears: WhereAnioMes[] = [];

        if (dateFrom && dateTo) {
            if (!yearFrom || !yearTo || !mesFromId || !mesToId) return NextResponse.json({message: "Error en los parámetros de fecha"}, {status: 400});

            let currentYear = Number(yearFrom);

            while (currentYear <= Number(yearTo)) {
                if (currentYear === Number(yearFrom) && currentYear === Number(yearTo)) {
                    // Caso especial: el from y to están en el mismo año
                    allPeriodsBetweenYears.push({
                        from: currentYear * 100 + mesFromId,
                        to: currentYear * 100 + mesToId,
                        anio: currentYear,
                    });
                } else if (currentYear === Number(yearFrom)) {
                    // Primer año: desde el mes especificado hasta diciembre
                    allPeriodsBetweenYears.push({
                        from: currentYear * 100 + mesFromId,
                        to: currentYear * 100 + 12,
                        anio: currentYear,
                    });
                } else if (currentYear === Number(yearTo)) {
                    // Último año: desde enero hasta el mes especificado
                    allPeriodsBetweenYears.push({
                        from: currentYear * 100 + 1,
                        to: currentYear * 100 + mesToId,
                        anio: currentYear,
                    });
                } else {
                    // Años intermedios: de enero a diciembre
                    allPeriodsBetweenYears.push({
                        from: currentYear * 100 + 1,
                        to: currentYear * 100 + 12,
                        anio: currentYear,
                    });
                }

                currentYear++;
            }
        } else if (dateFrom) {
            // Lógica para solo from
            if (!mesFromId) return NextResponse.json({message: "Error en los parámetros de fecha"}, {status: 400});

            const lastYear = await prisma.anio.findFirst({
                orderBy: {nombre: "desc"},
            });

            if (!lastYear) return NextResponse.json({message: "Error buscando el último año"}, {status: 404});

            let currentYear = Number(yearFrom);

            while (currentYear <= Number(lastYear.nombre)) {
                const startMonth = currentYear === Number(yearFrom) ? mesFromId : 1;

                allPeriodsBetweenYears.push({
                    from: currentYear * 100 + startMonth,
                    to: currentYear * 100 + 12,
                    anio: currentYear,
                });

                currentYear++;
            }
        } else if (dateTo) {
            // Lógica para solo to
            if (!mesToId) return NextResponse.json({message: "Error en los parámetros de fecha"}, {status: 400});

            const firstYear = await prisma.anio.findFirst({
                orderBy: {nombre: "asc"},
            });

            if (!firstYear) return NextResponse.json({message: "Error buscando el primer año"}, {status: 404});

            let currentYear = Number(firstYear.nombre);

            while (currentYear <= Number(yearTo)) {
                const endMonth = currentYear === Number(yearTo) ? mesToId : 12;

                allPeriodsBetweenYears.push({
                    from: currentYear * 100 + 1,
                    to: currentYear * 100 + endMonth,
                    anio: currentYear,
                });

                currentYear++;
            }
        } else {
            // Lógica para cuando no hay ni from ni to
            const firstYear = await prisma.anio.findFirst({
                orderBy: {nombre: "asc"},
            });
            const lastYear = await prisma.anio.findFirst({
                orderBy: {nombre: "desc"},
            });

            if (!firstYear || !lastYear) return NextResponse.json({message: "Error buscando años"}, {status: 404});

            let currentYear = Number(firstYear.nombre);

            while (currentYear <= Number(lastYear.nombre)) {
                allPeriodsBetweenYears.push({
                    from: currentYear * 100 + 1,
                    to: currentYear * 100 + 12,
                    anio: currentYear,
                });

                currentYear++;
            }
        }

        for (const area of areas) {
            let consumoArea = 0;
            let consumoTotal = 0;
            let totalEmisionCO2 = 0;
            let totalEmisionCH4 = 0;
            let totalEmisionN2O = 0;
            let totalGEI = 0;

            const energiaCalculos = await prisma.energiaCalculos.create({
                data: {
                    consumoArea: 0,
                    factorConversion: 0,
                    consumoTotal: 0,
                    emisionCO2: 0,
                    emisionCH4: 0,
                    emisionN2O: 0,
                    totalGEI: 0,
                    areaId: area.id,
                    periodoCalculoId: period.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            for (const period of allPeriodsBetweenYears) {
                const anioId = await getAnioId(period.anio!.toString());
                const factorSEIN = await prisma.factorConversionSEIN.findFirst({
                    where: {anioId},
                });

                if (!factorSEIN) return NextResponse.json({message: `Agregue el factor de emisión para el año ${period.anio}`}, {status: 404});

                let whereOptionDetails = whereOptionsConsumoElectricidad;
                whereOptionDetails.areaId = area.id;
                whereOptionDetails.anio_mes = {gte: period.from, lte: period.to};

                const electricidad = await prisma.consumoEnergia.findMany({
                    where: whereOptionDetails
                });

                const totalConsumo: number = electricidad.reduce((acc, consumoEnergia) => {
                    if (consumoEnergia.anio_id === anioId) {
                        return acc + consumoEnergia.consumo;
                    }
                    return acc;
                }, 0);

                const consumo = totalConsumo;
                const emisionCO2 = factorSEIN.factorCO2 * consumo;
                const emisionCH4 = 0;
                const emisionN2O = 0;
                // const totalEmisionesAnuales = emisionCO2 + emisionCH4 + emisionN2O;
                const totalEmisionesAnuales = emisionCO2;

                await prisma.energiaCalculosDetail.create({
                    data: {
                        areaId: area.id,
                        consumoArea: totalConsumo,
                        factorConversion: factorConversion,
                        consumoTotal: consumo,
                        emisionCO2: emisionCO2,
                        emisionCH4: emisionCH4,
                        emisionN2O: emisionN2O,
                        totalGEI: totalEmisionesAnuales,
                        factorConversionSEINId: factorSEIN.id,
                        energiaCalculosId: energiaCalculos.id,

                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                consumoArea += totalConsumo;
                consumoTotal += consumo;
                totalEmisionCO2 += emisionCO2;
                totalEmisionCH4 += emisionCH4;
                totalEmisionN2O += emisionN2O;
                totalGEI += totalEmisionesAnuales;
            }

            await prisma.energiaCalculos.update({
                where: {id: energiaCalculos.id},
                data: {
                    consumoArea: consumoArea,
                    factorConversion: factorConversion,
                    consumoTotal: consumoTotal,
                    emisionCO2: totalEmisionCO2 / 1000,
                    emisionCH4: totalEmisionCH4 / 1000,
                    emisionN2O: totalEmisionN2O / 1000,
                    totalGEI: totalGEI / 1000,
                    updated_at: new Date(),
                },
            });
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculating combustion", error);
        return NextResponse.json({message: "Error calculating combustion"}, {status: 500});
    }
}