import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";
import {transporteAereoCalcRequest} from "@/components/transporteAereo/service/transporteAereoCalculos.interface";
import {formatConsumoAguaCalculo} from "@/lib/resources/consumoAguaCalculateResource";
import {formatTransporteAereoCalculo} from "@/lib/resources/transporteAereoCalculateResource";

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

        if (!period && all)
            return new NextResponse("Periodo no encontrado", {status: 404});

        const whereOptions = {
            sedeId: sedeId ? Number(sedeId) : undefined,
            periodoCalculoId: period?.id,
        };

        const totalRecords = await prisma.transporteAereoCalculos.count({
            where: whereOptions,
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        const transporteAereoCalculos = await prisma.transporteAereoCalculos.findMany({
            where: whereOptions,
            include: {
                sede: true,
                TransporteAereoCalculosDetail: {
                    include: {
                        factorEmisionTransporteAereo: {
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

        const formattedTransporteAereoCalculos: any[] = transporteAereoCalculos
            .map((transporteAereoCalculo: any, index: number) => {
                if (transporteAereoCalculo.consumo !== 0) {
                    transporteAereoCalculo.rn = (page - 1) * perPage + index + 1;
                    return formatTransporteAereoCalculo(transporteAereoCalculo);
                }
                return null;
            })
            .filter((transporteAereoCalculo) => transporteAereoCalculo !== null);

        return NextResponse.json({
            data: formattedTransporteAereoCalculos,
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
        const body: transporteAereoCalcRequest = await req.json();
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

        const whereOptionsTransporteAereo = {
            sede_id: sedeId ? Number(sedeId) : undefined,
        } as {
            sede_id?: number;
            anio_mes?: { gte?: number; lte?: number };
            distanciaTramo?: { lte?: number; gte?: number };
        };

        await prisma.transporteAereoCalculosDetail.deleteMany({
            where: {
                sedeId: sedeId ? Number(sedeId) : undefined,
                transporteAereoCalculos: {
                    periodoCalculoId: period.id,
                },
            },
        });

        await prisma.transporteAereoCalculos.deleteMany({
            where: {
                sedeId: sedeId ? Number(sedeId) : undefined,
                periodoCalculoId: period.id,
            },
        });

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

        const intervals = [
            {value: "1600", lte: 1600},
            {value: "1600_3700", gte: 1600, lte: 3700},
            {value: "3700", gte: 3700},
        ] as {
            value: string;
            gte?: number;
            lte?: number;
        }[];

        for (const interval of intervals) {
            let consumo = 0;
            let totalGEI = 0;

            const transporteAereoCalculos = await prisma.transporteAereoCalculos.create({
                data: {
                    intervalo: interval.value,
                    consumo: 0,
                    totalGEI: 0,
                    sedeId: sedeId,
                    periodoCalculoId: period.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            for (const period of allPeriodsBetweenYears) {
                const anioId = await getAnioId(period.anio!.toString());
                const factorEmision = await prisma.factorEmisionTransporteAereo.findFirst({
                    where: {anio_id: anioId},
                });

                if (!factorEmision)
                    return new NextResponse(
                        "No se encontró el factor de emisión para el año seleccionado",
                        {status: 404}
                    );

                let whereOptionDetails = whereOptionsTransporteAereo;
                whereOptionDetails.sede_id = sedeId;
                whereOptionDetails.anio_mes = {gte: period.from, lte: period.to};
                whereOptionDetails.distanciaTramo = {gte: interval.gte, lte: interval.lte};

                const transporteAereo = await prisma.transporteAereo.findMany({
                    where: whereOptionDetails,
                });

                const totalConsumo = transporteAereo.reduce(
                    (acc, transporteAereo) => acc + transporteAereo.kmRecorrido,
                    0
                );
                let totalEmisiones = 0;
                switch (interval.value) {
                    case "1600":
                        totalEmisiones = totalConsumo * factorEmision.factor1600;
                        break;
                    case "1600_3700":
                        totalEmisiones = totalConsumo * factorEmision.factor1600_3700;
                        break;
                    case "3700":
                        totalEmisiones = totalConsumo * factorEmision.factor3700;
                        break;
                }

                await prisma.transporteAereoCalculosDetail.create({
                    data: {
                        intervalo: interval.value,
                        consumo: totalConsumo,
                        factorEmisionAereoId: factorEmision.id,
                        totalGEI: totalEmisiones,
                        sedeId: sedeId,
                        transporteAereoCalculosId: transporteAereoCalculos.id,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
                consumo += totalConsumo;
                totalGEI += totalEmisiones;
            }

            await prisma.transporteAereoCalculos.update({
                where: {id: transporteAereoCalculos.id},
                data: {
                    consumo: consumo,
                    totalGEI: totalGEI / 1000,
                    updated_at: new Date(),
                },
            });
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculando Transporte Aereos", error);
        return new NextResponse("Error calculando Transporte Aereos", {
            status: 500,
        });
    }
}
