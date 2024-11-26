import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";
import {
    transporteTerrestreCalcRequest
} from "@/components/transporteTerrestre/service/transporteTerrestreCalculos.interface";
import {formatTransporteTerrestreCalculo} from "@/lib/resources/transporteTerrestreCalculateResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);

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

        if (!period && all)
            return new NextResponse("Periodo no encontrado", {status: 404});

        console.log("Periodo", period);
        const whereOptions = {
            periodoCalculoId: period?.id,
        };

        const totalRecords = await prisma.transporteTerrestreCalculos.count({
            where: whereOptions,
        });

        const totalPages = Math.ceil(totalRecords / perPage);

        const transporteTerrestreCalculos = await prisma.transporteTerrestreCalculos.findMany({
            where: whereOptions,
            include: {
                sede: true,
                TransporteTerrestreCalculosDetail: {
                    include: {
                        factorEmisionTransporteTerrestre: {
                            include: {
                                anio: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{sede: {name: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedTransporteTerrestreCalculos: any[] = transporteTerrestreCalculos
            .map((transporteTerrestreCalculo: any, index: number) => {
                if (transporteTerrestreCalculo.consumo !== 0) {
                    transporteTerrestreCalculo.id = index + 1;
                    return formatTransporteTerrestreCalculo(transporteTerrestreCalculo);
                }
                return null;
            })
            .filter((transporteTerrestreCalculo) => transporteTerrestreCalculo !== null);

        return NextResponse.json({
            data: formattedTransporteTerrestreCalculos,
            meta: {
                page,
                perPage,
                totalPages,
                totalRecords,
            },
        });
    } catch (error) {
        console.error("Error buscando calculos", error);
        return new NextResponse("Error buscando calculos", {status: 500});
    }
}

interface WhereAnioMes {
    from?: number;
    to?: number;
    anio?: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: transporteTerrestreCalcRequest = await req.json();
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

        const sedes = await prisma.sede.findMany();

        const whereOptionsTransporteTerrestre = {
            sede_id: sedeId ? Number(sedeId) : undefined,
        } as {
            sede_id?: number;
            anio_mes?: { gte?: number; lte?: number };
        };

        await prisma.transporteTerrestreCalculosDetail.deleteMany({
            where: {
                transporteTerrestreCalculos: {
                    periodoCalculoId: period.id,
                },
            },
        });

        await prisma.transporteTerrestreCalculos.deleteMany({
            where: {
                sedeId: sedeId ? Number(sedeId) : undefined,
                periodoCalculoId: period.id,
            },
        });

        const factorEmision: number = 0.344;
        const allPeriodsBetweenYears: WhereAnioMes[] = [];

        if (dateFrom && dateTo) {
            if (!yearFrom || !yearTo || !mesFromId || !mesToId)
                return new NextResponse("Error en los parámetros de fecha", {
                    status: 400,
                });

            let currentYear = Number(yearFrom);

            while (currentYear <= Number(yearTo)) {
                if (
                    currentYear === Number(yearFrom) &&
                    currentYear === Number(yearTo)
                ) {
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
            if (!mesFromId)
                return new NextResponse("Error en los parámetros de fecha", {
                    status: 400,
                });

            const lastYear = await prisma.anio.findFirst({
                orderBy: {nombre: "desc"},
            });

            if (!lastYear)
                return new NextResponse("Error buscando el último año", {
                    status: 404,
                });

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
            if (!mesToId)
                return new NextResponse("Error en los parámetros de fecha", {
                    status: 400,
                });

            const firstYear = await prisma.anio.findFirst({
                orderBy: {nombre: "asc"},
            });

            if (!firstYear)
                return new NextResponse("Error buscando el primer año", {
                    status: 404,
                });

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

            if (!firstYear || !lastYear)
                return new NextResponse("Error buscando años", {status: 404});

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

        for (const sede of sedes) {
            let consumo = 0;
            let totalGEI = 0;

            const transporteTerrestreCalculos = await prisma.transporteTerrestreCalculos.create({
                data: {
                    consumo: 0,
                    totalGEI: 0,
                    sedeId: sede.id,
                    periodoCalculoId: period.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            for (const period of allPeriodsBetweenYears) {
                const anioId = await getAnioId(period.anio!.toString());
                const factorEmision = await prisma.factorEmisionTransporteTerrestre.findFirst({
                    where: {anio_id: anioId},
                });

                if (!factorEmision)
                    return new NextResponse(
                        "No se encontró el factor de emisión para el año seleccionado",
                        {status: 404}
                    );

                let whereOptionDetails = whereOptionsTransporteTerrestre;
                whereOptionDetails.sede_id = sede.id;
                whereOptionDetails.anio_mes = {gte: period.from, lte: period.to};

                const transporteTerrestre = await prisma.transporteTerrestre.findMany({
                    where: whereOptionDetails,
                });

                const totalConsumo = transporteTerrestre.reduce(
                    (acc, transporteTerrestre) => acc + transporteTerrestre.distancia,
                    0
                );
                const totalEmisiones = factorEmision.factor * totalConsumo;

                await prisma.transporteTerrestreCalculosDetail.create({
                    data: {
                        consumo: totalConsumo,
                        factorEmisionTerrestreId: factorEmision.id,
                        totalGEI: totalEmisiones,
                        sedeId: sede.id,
                        transporteTerrestreCalculosId: transporteTerrestreCalculos.id,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                consumo += totalConsumo;
                totalGEI += totalEmisiones;
            }

            await prisma.transporteTerrestreCalculos.update({
                where: {id: transporteTerrestreCalculos.id},
                data: {
                    consumo: consumo,
                    totalGEI: totalGEI / 1000,
                    updated_at: new Date(),
                },
            });
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculando Transporte Terrestres", error);
        return new NextResponse("Error calculando Transporte Terrestres", {
            status: 500,
        });
    }
}
