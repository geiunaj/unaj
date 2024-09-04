import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    CombustionCalcRequest,
    CombustionCalculosRequest
} from "@/components/combustion/services/combustionCalculate.interface";
import {formatCombustibleCalculo} from "@/lib/resources/combustionCalculateResource";
import {getAnioId} from "@/lib/utils";
import {WhereAnioMes} from "@/lib/interfaces/globals";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId");
        const tipo = searchParams.get("tipo");
        if (!sedeId) return new NextResponse("SedeId is required", {status: 400});

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
                },
            });
        }

        if (!period && all) return new NextResponse("Periodo no encontrado", {status: 404,});

        const whereOptions = {
            sedeId: parseInt(sedeId),
            tipo: tipo ?? undefined,
            periodoCalculoId: period?.id,
            consumo: {
                not: 0
            },
        };

        const totalRecords = await prisma.combustibleCalculos.count({
            where: whereOptions
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        const combustibleCalculos = await prisma.combustibleCalculos.findMany({
            where: whereOptions,
            include: {
                tipoCombustible: true,
                sede: true,
            },
            orderBy: [{tipoCombustible: {nombre: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedCombustibleCalculos: any[] = combustibleCalculos
            .map((combustibleCalculo, index: number) => {
                combustibleCalculo.id = index + 1;
                return formatCombustibleCalculo(combustibleCalculo);
            });

        return NextResponse.json({
            data: formattedCombustibleCalculos,
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
        const body: CombustionCalcRequest = await req.json();
        const sedeId = body.sedeId;
        const tipo = body.tipo;
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

        const tiposCombustible = await prisma.tipoCombustible.findMany();

        const whereOptionsCombustion = {
            tipo: tipo,
            sede_id: sedeId,
        } as {
            tipo?: string;
            sede_id?: number;
            tipoCombustible_id?: number;
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        await prisma.combustibleCalculosDetail.deleteMany({
            where: {
                combustibleCalculos: {
                    periodoCalculoId: period.id,
                },
            },
        });

        await prisma.combustibleCalculos.deleteMany({
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

        console.log("allPeriodsBetweenYears", allPeriodsBetweenYears);

        let consumoTipoCombustible = 0;
        let consumoTotal = 0;
        let totalEmisionCO2 = 0;
        let totalEmisionCH4 = 0;
        let totalEmisionN2O = 0;
        let totalGEI = 0;

        for (const tipoCombustible of tiposCombustible) {
            const tipoCombustibleCalculos = await prisma.combustibleCalculos.create({
                data: {
                    tipo: tipo,
                    consumoTotal: 0,
                    valorCalorico: 0,
                    consumo: 0,
                    emisionCO2: 0,
                    emisionCH4: 0,
                    emisionN2O: 0,
                    totalGEI: 0,
                    periodoCalculoId: period.id,
                    sedeId: sedeId,
                    tipoCombustibleId: tipoCombustible.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            for (const period of allPeriodsBetweenYears) {
                const anio_id = await getAnioId(String(period.anio));
                const factorTipoCombustible = await prisma.tipoCombustibleFactor.findFirst({
                    where: {anio_id},
                });

                if (!factorTipoCombustible) return new NextResponse(`Agregue el factor de tipo de combustible para el año ${anio_id}`, {status: 404});

                let whereOptionDetails = whereOptionsCombustion;
                whereOptionDetails.tipoCombustible_id = tipoCombustible.id;
                whereOptionDetails.anio_mes = {gte: period.from, lte: period.to,};

                const combustibles = await prisma.combustible.findMany({
                    where: whereOptionDetails,
                });

                const consumoTipoCombustible: number = combustibles.reduce((acc, combustible) => {
                    if (combustible.anio_id === anio_id) {
                        return acc + combustible.consumo;
                    }
                    return acc;
                }, 0);

                const consumo = factorTipoCombustible.valorCalorico * consumoTipoCombustible;
                const emisionCO2 = factorTipoCombustible.factorEmisionCO2 * consumo;
                const emisionCH4 = factorTipoCombustible.factorEmisionCH4 * consumo;
                const emisionN2O = factorTipoCombustible.factorEmisionN2O * consumo;
                const totalEmisionesAnuales = emisionCO2 + emisionCH4 + emisionN2O;

            }
        }


        const from = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        if (from && to) {
            whereOptionsCombustion.anio_mes = {gte: from, lte: to,};
        } else if (from) {
            whereOptionsCombustion.anio_mes = {gte: from,};
        } else if (to) {
            whereOptionsCombustion.anio_mes = {lte: to,};
        }

        console.log(whereOptionsCombustion);

        const combustibles = await prisma.combustible.findMany({
            where: whereOptionsCombustion,
        });

        await prisma.combustibleCalculos.deleteMany({
            where: {
                tipo: tipo,
                sedeId: sedeId,
                periodoCalculoId: period.id,
            },
        });

        for (const tipoCombustible of tiposCombustible) {
            const totalConsumo: number = combustibles.reduce((acc, combustible) => {
                if (combustible.tipoCombustible_id === tipoCombustible.id) {
                    return acc + combustible.consumo;
                }
                return acc;
            }, 0);

            const valorCalorico = tipoCombustible.valorCalorico;
            const consumo = valorCalorico * totalConsumo;

            const totalEmisionCO2: number =
                tipoCombustible.factorEmisionCO2 * consumo;
            const totalEmisionCH4: number =
                tipoCombustible.factorEmisionCH4 * consumo;
            const totalEmisionN2O: number =
                tipoCombustible.factorEmisionN2O * consumo;
            const totalGEI: number =
                totalEmisionCO2 + totalEmisionCH4 + totalEmisionN2O;

            const calculoCombustible: CombustionCalculosRequest = {
                tipo: tipo,
                tipoCombustibleId: tipoCombustible.id,
                consumoTotal: totalConsumo,
                valorCalorico: valorCalorico,
                consumo: consumo,
                emisionCO2: totalEmisionCO2,
                emisionCH4: totalEmisionCH4,
                emisionN2O: totalEmisionN2O,
                totalGEI: totalGEI,
                periodoCalculoId: period.id,
                sedeId: sedeId,
            };

            const tipoCombustibleCreate = await prisma.combustibleCalculos.create({
                data: calculoCombustible,
                include: {
                    tipoCombustible: true,
                    sede: true,
                },
            });

            combustibleCalculos.push(tipoCombustibleCreate);
        }

        const formattedCombustibleCalculos: any[] = combustibleCalculos.map(
            (combustibleCalculo) => formatCombustibleCalculo(combustibleCalculo)
        );

        return NextResponse.json(formattedCombustibleCalculos);
    } catch (error) {
        console.error("Error calculating combustion", error);
        return new NextResponse("Error calculating combustion", {status: 500});
    }
}
