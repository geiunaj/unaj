import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";
import {WhereAnioMes} from "@/lib/interfaces/globals";
import {formatTransporteCasaTrabajoCalculo} from "@/lib/resources/transporteCasaTrabajoCalculateResource";
import {
    TransporteCasaTrabajoCalcRequest
} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajoCalculate.interface";

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
            kmRecorrido: {
                not: 0
            },
        };

        const totalRecords = await prisma.casaTrabajoCalculos.count({
            where: whereOptions
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        const transporteCasaTrabajoCalculos = await prisma.casaTrabajoCalculos.findMany({
            where: whereOptions,
            include: {
                tipoVehiculo: true,
                sede: true,
                CasaTrabajoCalculosDetail: {
                    include: {
                        factorCasaTrabajo: {
                            include: {
                                anio: true
                            }
                        }
                    }
                }
            },
            orderBy: [{tipoVehiculo: {nombre: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedTransporteCasaTrabajoCalculos: any[] = transporteCasaTrabajoCalculos
            .map((transporteCasaTrabajoCalculo, index: number) => {
                const consumo = formatTransporteCasaTrabajoCalculo(transporteCasaTrabajoCalculo);
                consumo.rn = (page - 1) * perPage + index + 1;
                return consumo;
            });

        return NextResponse.json({
            data: formattedTransporteCasaTrabajoCalculos,
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
        const body: TransporteCasaTrabajoCalcRequest = await req.json();
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

        const tipoVehiculos = await prisma.tipoVehiculo.findMany();

        const whereOptionsTransporteCasaTrabajo = {
            sedeId: sedeId,
        } as {
            sedeId?: number;
            tipoVehiculoId?: number;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        await prisma.casaTrabajoCalculosDetail.deleteMany({
            where: {
                casaTrabajoCalculos: {
                    periodoCalculoId: period.id,
                },
            },
        });

        await prisma.casaTrabajoCalculos.deleteMany({
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

        for (const tipoVehiculo of tipoVehiculos) {
            let consumoTipoTransporteCasaTrabajo = 0;
            let totalGEI = 0;

            const transporteCasaTrabajoCalculo = await prisma.casaTrabajoCalculos.create({
                data: {
                    tipoVehiculoId: tipoVehiculo.id,
                    periodoCalculoId: period.id,
                    sedeId: sedeId,
                    kmRecorrido: 0,
                    totalGEI: 0,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            for (const period of allPeriodsBetweenYears) {
                const anioId = await getAnioId(String(period.anio));
                const factorTipoVehiculo = await prisma.factorTransporteCasaTrabajo.findFirst({
                    where: {anioId, tipoVehiculoId: tipoVehiculo.id},
                });

                if (!factorTipoVehiculo) return NextResponse.json({message: `Agregue el factor de tipo de vehiculo de ${tipoVehiculo.nombre} para el año ${period.anio}`}, {status: 404});

                let whereOptionDetails = whereOptionsTransporteCasaTrabajo;
                whereOptionDetails.sedeId = sedeId;
                whereOptionDetails.anio_mes = {gte: period.from, lte: period.to,};
                whereOptionDetails.tipoVehiculoId = tipoVehiculo.id;

                const transporteCasaTrabajos = await prisma.casaTrabajo.findMany({
                    where: whereOptionDetails,
                });

                const consumoTotalTipoTransporteCasaTrabajo: number = transporteCasaTrabajos.reduce((acc, transporteCasaTrabajo) => {
                    if (transporteCasaTrabajo.anioId === anioId) {
                        return acc + transporteCasaTrabajo.kmRecorrido;
                    }
                    return acc;
                }, 0);

                const totalGEITransporteCasaTrabajo: number = consumoTotalTipoTransporteCasaTrabajo * factorTipoVehiculo.factor;

                await prisma.casaTrabajoCalculosDetail.create({
                    data: {
                        tipoVehiculoId: tipoVehiculo.id,
                        factorCasaTrabajoId: factorTipoVehiculo.id,
                        casaTrabajoCalculosId: transporteCasaTrabajoCalculo.id,
                        anioId: anioId!,
                        sedeId: sedeId,
                        kmRecorrido: consumoTotalTipoTransporteCasaTrabajo,
                        totalGEI: totalGEITransporteCasaTrabajo,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                consumoTipoTransporteCasaTrabajo += consumoTotalTipoTransporteCasaTrabajo;
                totalGEI += totalGEITransporteCasaTrabajo;
            }

            await prisma.casaTrabajoCalculos.update({
                where: {id: transporteCasaTrabajoCalculo.id},
                data: {
                    kmRecorrido: consumoTipoTransporteCasaTrabajo,
                    totalGEI: totalGEI / 1000,
                    updated_at: new Date(),
                }
            })
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculating transporteCasaTrabajo", error);
        return new NextResponse("Error calculating transporteCasaTrabajo", {status: 500});
    }
}
