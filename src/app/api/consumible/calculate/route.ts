import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";
import {WhereAnioMes} from "@/lib/interfaces/globals";
import {formatConsumibleCalculo} from "@/lib/resources/consumibleCalculateResource";
import {ConsumibleCalcRequest} from "@/components/consumibles/services/consumibleCalculate.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId");
        if (!sedeId) return new NextResponse("SedeId is required", {status: 400});

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

        if (!period && all) return new NextResponse("Periodo no encontrado", {status: 404,});

        const whereOptions = {
            sedeId: parseInt(sedeId),
            periodoCalculoId: period?.id,
            pesoTotal: {
                not: 0
            },
        };

        const totalRecords = await prisma.consumibleCalculos.count({
            where: whereOptions
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        const consumibleCalculos = await prisma.consumibleCalculos.findMany({
            where: whereOptions,
            include: {
                tipoConsumible: {
                    include: {
                        descripcion: true,
                        categoria: true,
                        grupo: true,
                        proceso: true,
                    }
                },
                sede: true,
            },
            orderBy: [{tipoConsumible: {nombre: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedConsumibleCalculos: any[] = consumibleCalculos
            .map((consumibleCalculo, index: number) => {
                consumibleCalculo.id = index + 1;
                return formatConsumibleCalculo(consumibleCalculo);
            });

        return NextResponse.json({
            data: formattedConsumibleCalculos,
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
        const body: ConsumibleCalcRequest = await req.json();
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

        const tiposConsumible = await prisma.tipoConsumible.findMany();

        const whereOptionsConsumible = {
            sedeId: sedeId,
        } as {
            sedeId?: number;
            tipoConsumibleId?: number;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        await prisma.consumibleCalculosDetail.deleteMany({
            where: {
                consumibleCalculos: {
                    periodoCalculoId: period.id,
                },
            },
        });

        await prisma.consumibleCalculos.deleteMany({
            where: {
                sedeId: sedeId,
                periodoCalculoId: period.id,
            },
        });

        const allPeriodsBetweenYears: WhereAnioMes[] = [];

        if (dateFrom && dateTo) {
            if (!yearFrom || !yearTo || !mesFromId || !mesToId) return new NextResponse("Error en los parámetros de fecha", {status: 400});
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
            if (!mesFromId) return new NextResponse("Error en los parámetros de fecha", {status: 400});

            const lastYear = await prisma.anio.findFirst({
                orderBy: {nombre: "desc"},
            });

            if (!lastYear) return new NextResponse("Error buscando el último año", {status: 404});

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
            if (!mesToId) return new NextResponse("Error en los parámetros de fecha", {status: 400});

            const firstYear = await prisma.anio.findFirst({
                orderBy: {nombre: "asc"},
            });

            if (!firstYear) return new NextResponse("Error buscando el primer año", {status: 404});

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

            if (!firstYear || !lastYear) return new NextResponse("Error buscando años", {status: 404});
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

        for (const tipoConsumible of tiposConsumible) {
            let consumoTipoConsumible = 0;
            let totalGEI = 0;

            const tipoConsumibleCalculos = await prisma.consumibleCalculos.create({
                data: {
                    pesoTotal: 0,
                    totalGEI: 0,
                    periodoCalculoId: period.id,
                    sedeId: sedeId,
                    tipoConsumibleId: tipoConsumible.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            for (const period of allPeriodsBetweenYears) {
                const anioId = await getAnioId(String(period.anio));
                const factorTipoConsumible = await prisma.factorTipoConsumible.findFirst({
                    where: {anioId, tipoConsumibleId: tipoConsumible.id},
                });

                if (!factorTipoConsumible) return new NextResponse(`Agregue el factor de tipo de consumible de ${tipoConsumible.nombre} para el año ${period.anio}`, {status: 404});

                let whereOptionDetails = whereOptionsConsumible;
                whereOptionDetails.tipoConsumibleId = tipoConsumible.id;
                whereOptionDetails.anio_mes = {gte: period.from, lte: period.to,};

                const consumibles = await prisma.consumible.findMany({
                    where: whereOptionDetails,
                });

                const pesoTotalTipoConsumible: number = consumibles.reduce((acc, consumible) => {
                    if (consumible.anioId === anioId) {
                        return acc + consumible.pesoTotal;
                    }
                    return acc;
                }, 0);

                const totalGEIConsumible: number = pesoTotalTipoConsumible * factorTipoConsumible.factor;


                await prisma.consumibleCalculosDetail.create({
                    data: {
                        tipoConsumibleId: tipoConsumible.id,
                        factorTipoConsumibleId: factorTipoConsumible.id,
                        pesoTotal: pesoTotalTipoConsumible,
                        totalGEI: totalGEIConsumible,
                        anioId: anioId!,
                        sedeId: sedeId,
                        consumibleCalculosId: tipoConsumibleCalculos.id,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                consumoTipoConsumible += pesoTotalTipoConsumible;
                totalGEI += totalGEIConsumible;

                if (tipoConsumible.unidad === "L") {
                    console.log(factorTipoConsumible);
                    console.log(tipoConsumible);
                    console.log(pesoTotalTipoConsumible);
                    console.log(totalGEIConsumible);
                    console.log(consumoTipoConsumible);
                    console.log(totalGEI);
                }
            }

            await prisma.consumibleCalculos.update({
                where: {id: tipoConsumibleCalculos.id},
                data: {
                    pesoTotal: consumoTipoConsumible,
                    totalGEI: (totalGEI / 1000) / 0.95,
                    updated_at: new Date(),
                }
            })
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculating consumible", error);
        return new NextResponse("Error calculating consumible", {status: 500});
    }
}
