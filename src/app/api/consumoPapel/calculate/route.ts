import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";
import {formatConsumoPapelCalculo} from "@/lib/resources/consumoPapelCalculateResource";
import {ConsumoPapelCalculoRequest} from "@/components/consumoPapel/services/consumoPapelCalculate.interface";
import {WhereAnioMes} from "@/lib/interfaces/globals";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);

        const sedeId = searchParams.get("sedeId");
        const all = searchParams.get("all") === "true";
        const yearFrom = searchParams.get("yearFrom") ?? undefined;
        const yearTo = searchParams.get("yearTo") ?? undefined;

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        let yearFromId = await getAnioId(yearFrom ?? "");
        let yearToId = await getAnioId(yearTo ?? "");

        let period = await prisma.periodoCalculo.findFirst({
            where: {
                yearInicio: yearFromId ? yearFrom : null,
                yearFin: yearToId ? yearTo : null,
            },
        });

        if (!period) {
            period = await prisma.periodoCalculo.create({
                data: {
                    yearInicio: yearFromId ? yearFrom : null,
                    yearFin: yearToId ? yearTo : null,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }


        const whereOptions = {
            sede_id: sedeId ? parseInt(sedeId) : undefined,
            period_id: period?.id,
            consumo: {not: 0},
        };

        const totalRecords = await prisma.consumoPapelCalculos.count({where: whereOptions});
        const totalPages = Math.ceil(totalRecords / perPage);

        const consumoPapelCalculos = await prisma.consumoPapelCalculos.findMany({
            where: whereOptions,
            include: {
                tipoPapel: true,
                sede: true,
            },
            orderBy: [{tipoPapel: {nombre: 'asc'}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedConsumoPapelCalculos = consumoPapelCalculos.map(
            (consumoPapelCalculo, index) => {
                const consumo = formatConsumoPapelCalculo(consumoPapelCalculo);
                consumo.rn = (page - 1) * perPage + index + 1;
                return consumo;
            }
        );

        return NextResponse.json({
            data: formattedConsumoPapelCalculos,
            meta: {
                page,
                perPage,
                totalPages,
                totalRecords,
            },
        });

    } catch (error) {
        console.error("Error buscando emisiones de papel", error);
        return new NextResponse("Error buscando emisiones de papel", {status: 500,});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: ConsumoPapelCalculoRequest = await req.json();
        if (!body) return NextResponse.json([{error: "Missing body"}]);
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
                yearInicio: yearFromId ? yearFrom : null,
                yearFin: yearToId ? yearTo : null,
                fechaInicioValue: fromValue,
                fechaFinValue: toValue,
            },
        });

        if (!period) {
            period = await prisma.periodoCalculo.create({
                data: {
                    yearInicio: yearFromId ? yearFrom : null,
                    yearFin: yearToId ? yearTo : null,
                    fechaInicioValue: fromValue,
                    fechaFinValue: toValue,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }


        const tiposPapel = await prisma.tipoPapel.findMany();

        const whereOptionsConsumoPapel = {
            sede_id: sedeId,
        } as {
            sede_id: number;
            tipoPapel_id?: number;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        await prisma.consumoPapelCalculosDetail.deleteMany({
            where: {
                consumoPapelCalculos: {
                    sede_id: sedeId,
                    period_id: period.id,
                }
            },
        })

        await prisma.consumoPapelCalculos.deleteMany({
            where: {
                sede_id: sedeId,
                period_id: period.id,
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

        for (const tipoPapel of tiposPapel) {
            let totalTipoPapel = 0;
            let totalConsumo = 0;
            let totalEmisionGEI = 0;

            const consumoPapelCalculo = await prisma.consumoPapelCalculos.create({
                data: {
                    consumo: 0,
                    totalGEI: 0,
                    tipoPapel_id: tipoPapel.id,
                    sede_id: sedeId,
                    period_id: period.id,
                },
            });

            for (const period of allPeriodsBetweenYears) {
                const anioId = await getAnioId(String(period.anio));
                if (!anioId) return new NextResponse(`Error buscando el año ${period.anio}`, {status: 404});
                const factorTipoPapel = await prisma.factorTipoPapel.findFirst({
                    where: {anioId, tipoPapelId: tipoPapel.id},
                });
                if (!factorTipoPapel) return new NextResponse(`Agregue el factor de tipo de papel de ${tipoPapel.nombre} para el año ${period.anio}`, {status: 404});

                let whereOptionsDetails = whereOptionsConsumoPapel;
                whereOptionsDetails.tipoPapel_id = tipoPapel.id;
                whereOptionsDetails.anio_mes = {gte: period.from, lte: period.to,};

                const consumoPapel = await prisma.consumoPapel.findMany({
                    where: whereOptionsDetails,
                });

                const totalConsumoYear: number = consumoPapel.reduce((acc, consumoPapel) => {
                    return acc + consumoPapel.peso;
                }, 0);

                const emisionoGEI = totalConsumoYear * factorTipoPapel.factor;

                await prisma.consumoPapelCalculosDetail.create({
                    data: {
                        factorTipoPapelId: factorTipoPapel.id,
                        consumo: totalConsumoYear,
                        totalGEI: emisionoGEI,
                        consumoPapelCalculosId: consumoPapelCalculo.id,
                        sedeId: sedeId,
                        anioId: anioId,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                totalTipoPapel += totalConsumoYear;
                totalEmisionGEI += emisionoGEI;
            }

            await prisma.consumoPapelCalculos.update({
                where: {id: consumoPapelCalculo.id,},
                data: {
                    consumo: totalConsumo,
                    totalGEI: totalEmisionGEI / 1000,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculando consumos de papel", error);
        return new NextResponse("Error calculando consumos de papel", {
            status: 500,
        });
    }
}
