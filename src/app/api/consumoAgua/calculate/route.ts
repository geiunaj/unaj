import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";
import {
    consumoAguaCalcRequest,
    consumoAguaCalculoRequest
} from "@/components/consumoAgua/services/consumoAguaCalculos.interface";
import {formatConsumoAguaCalculo} from "@/lib/resources/consumoAguaCalculateResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId");

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
                }
            })
        }

        if (!period && all) return new NextResponse("Periodo no encontrado", {status: 404,});

        const whereOptions = {
            area: {
                sede_id: sedeId ? Number(sedeId) : undefined,
            },
            periodoCalculoId: period?.id,
        };

        const totalRecords = await prisma.consumoAguaCalculos.count({
            where: whereOptions
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        const consumoAguaCalculos = await prisma.consumoAguaCalculos.findMany({
            where: whereOptions,
            include: {
                area: {
                    include: {
                        sede: true
                    }
                },
                ConsumoAguaCalculosDetail: {
                    include: {
                        factorEmisionAgua: {
                            include: {
                                anio: true
                            }
                        }
                    }
                }

            },
            orderBy: [{area: {nombre: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedConsumoAguaCalculos: any[] = consumoAguaCalculos
            .map((consumoAguaCalculo: any, index: number) => {
                if (consumoAguaCalculo.consumoArea !== 0) {
                    consumoAguaCalculo.id = index + 1;
                    return formatConsumoAguaCalculo(consumoAguaCalculo);
                }
                return null;
            })
            .filter((combustibleCalculo) => combustibleCalculo !== null);


        return NextResponse.json({
            data: formattedConsumoAguaCalculos,
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


interface WhereAnioMes {
    from?: number;
    to?: number;
    anio?: number;
}


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: consumoAguaCalcRequest = await req.json();
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

        const areas = await prisma.area.findMany({
            where: {sede_id: sedeId},
        });

        const whereOptionsConsumoAgua = {
            area: {sede_id: sedeId ? Number(sedeId) : undefined,},
            fuenteAgua: "Red Publica",
        } as {
            area_id?: number;
            area: { sede_id: number };
            anio_mes?: { gte?: number; lte?: number };
        };

        await prisma.consumoAguaCalculosDetail.deleteMany({
            where: {
                consumoAguaCaluclos: {
                    periodoCalculoId: period.id
                }
            }
        })

        await prisma.consumoAguaCalculos.deleteMany({
            where: {
                area: {sede_id: sedeId ? Number(sedeId) : undefined,},
                periodoCalculoId: period.id,
            },
        });

        const factorEmision: number = 0.344;
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

        console.log("allPeriodsBetweenYears", allPeriodsBetweenYears);

        let consumoArea = 0;
        let totalGEI = 0;

        for (const area of areas) {
            const aguaCalculos = await prisma.consumoAguaCalculos.create({
                data: {
                    consumoArea: 0,
                    totalGEI: 0,
                    areaId: area.id,
                    periodoCalculoId: period.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            for (const period of allPeriodsBetweenYears) {
                const anioId = await getAnioId(period.anio!.toString());
                const factorEmisionAgua = await prisma.factorEmisionAgua.findFirst({
                    where: {anio_id: anioId},
                });

                if (!factorEmisionAgua) return new NextResponse("No se encontró el factor de emisión para el año seleccionado", {status: 404});

                let whereOptionDetails = whereOptionsConsumoAgua;
                whereOptionDetails.area_id = area.id;
                whereOptionDetails.anio_mes = {gte: period.from, lte: period.to};

                const consumoAgua = await prisma.consumoAgua.findMany({
                    where: whereOptionDetails
                });

                const totalConsumo = consumoAgua.reduce((acc, consumo) => acc + consumo.consumo, 0);
                const totalEmisiones = factorEmisionAgua.factor * totalConsumo;

                await prisma.consumoAguaCalculosDetail.create({
                    data: {
                        areaId: area.id,
                        consumoArea: totalConsumo,
                        totalGEI: totalEmisiones,
                        factorEmisionAguaId: factorEmisionAgua.id,
                        consumoAguaCalculosId: aguaCalculos.id,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                consumoArea += totalConsumo;
                totalGEI += totalEmisiones;
            }

            await prisma.consumoAguaCalculos.update({
                where: {id: aguaCalculos.id},
                data: {
                    consumoArea: consumoArea,
                    totalGEI: totalGEI,
                    updated_at: new Date(),
                },
            });
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculating water consumption", error);
        return new NextResponse("Error calculating water consumption", {status: 500});
    }
}