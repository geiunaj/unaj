import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";
import {WhereAnioMes} from "@/lib/interfaces/globals";
import {formatActivoCalculo} from "@/lib/resources/activoCalculateResource";
import {ActivoCalcRequest} from "@/components/activos/services/activosCalculate.interface";
import {formatCombustible} from "@/lib/resources/combustionResource";

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
            cantidadTotal: {
                not: 0
            },
        };

        const totalRecords = await prisma.activoCalculos.count({
            where: whereOptions
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        const activoCalculos = await prisma.activoCalculos.findMany({
            where: whereOptions,
            include: {
                grupoActivo: true,
                sede: true,
                ActivoCalculosDetail: {
                    include: {
                        factorTipoActivo: {
                            include: {
                                anio: true
                            }
                        }
                    }
                }
            },
            orderBy: [{grupoActivo: {nombre: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedActivoCalculos: any[] = activoCalculos
            .map((activoCalculo, index: number) => {
                if (activoCalculo.cantidadTotal !== 0) {
                    const consumo = formatActivoCalculo(activoCalculo);
                    consumo.rn = (page - 1) * perPage + index + 1;
                    return consumo;
                }
                return null;
            }).filter((activoCalculo) => activoCalculo !== null);

        return NextResponse.json({
            data: formattedActivoCalculos,
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
        const body: ActivoCalcRequest = await req.json();
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

        const gruposActivo = await prisma.grupoActivo.findMany();

        const whereOptionsActivo = {
            sedeId: sedeId,
        } as {
            sedeId?: number;
            grupoActivoId?: number;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        await prisma.activoCalculosDetail.deleteMany({
            where: {
                activoCalculos: {
                    periodoCalculoId: period.id,
                },
            },
        });

        await prisma.activoCalculos.deleteMany({
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

        for (const grupoActivo of gruposActivo) {
            let consumoTipoActivo = 0;
            let totalGEI = 0;

            const tipoActivoCalculos = await prisma.activoCalculos.create({
                data: {
                    cantidadTotal: 0,
                    totalGEI: 0,
                    periodoCalculoId: period.id,
                    sedeId: sedeId,
                    grupoActivoId: grupoActivo.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            for (const period of allPeriodsBetweenYears) {
                const anioId = await getAnioId(String(period.anio));
                const factorTipoActivo = await prisma.factorTipoActivo.findFirst({
                    where: {anioId, grupoActivoId: grupoActivo.id},
                });

                if (!factorTipoActivo) return NextResponse.json({message: `Agregue el factor de tipo de activo de ${grupoActivo.nombre} para el año ${period.anio}`}, {status: 404});

                let whereOptionDetails = whereOptionsActivo;
                whereOptionDetails.sedeId = sedeId;
                whereOptionDetails.anio_mes = {gte: period.from, lte: period.to,};

                const activos = await prisma.activo.findMany({
                    where: {
                        sedeId: whereOptionDetails.sedeId,
                        anio_mes: whereOptionDetails.anio_mes,
                        tipoActivo: {
                            categoria: {
                                grupoActivoId: grupoActivo.id
                            }
                        }
                    },
                });

                const consumoTotalTipoActivo: number = activos.reduce((acc, activo) => {
                    if (activo.anioId === anioId) {
                        return acc + activo.consumoTotal;
                    }
                    return acc;
                }, 0);

                const totalGEIActivo: number = consumoTotalTipoActivo * factorTipoActivo.factor;

                console.log(grupoActivo, factorTipoActivo, consumoTotalTipoActivo, totalGEIActivo);
                await prisma.activoCalculosDetail.create({
                    data: {
                        grupoActivoId: grupoActivo.id,
                        factorTipoActivoId: factorTipoActivo.id,
                        cantidadTotal: consumoTotalTipoActivo,
                        totalGEI: totalGEIActivo,
                        anioId: anioId!,
                        sedeId: sedeId,
                        activoCalculosId: tipoActivoCalculos.id,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                consumoTipoActivo += consumoTotalTipoActivo;
                totalGEI += totalGEIActivo;
            }

            await prisma.activoCalculos.update({
                where: {id: tipoActivoCalculos.id},
                data: {
                    cantidadTotal: consumoTipoActivo,
                    totalGEI: totalGEI / 1000,
                    updated_at: new Date(),
                }
            })
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculating activo", error);
        return new NextResponse("Error calculating activo", {status: 500});
    }
}
