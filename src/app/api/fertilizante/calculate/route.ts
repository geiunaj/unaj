import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    FertilizanteCalc,
    FertilizanteCalcRequest,
} from "@/components/fertilizantes/services/fertilizanteCalculate.interface";
import {formatFertilizanteCalculo} from "@/lib/resources/fertilizanteCalculateResource";
import {getAnioId} from "@/lib/utils";

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

        console.log(period);

        const whereOptions = {
            sedeId: sedeId ? parseInt(sedeId) : undefined,
            periodoCalculoId: period?.id,
            consumoTotal: {not: 0},
        };

        const totalRecords = await prisma.fertilizanteCalculos.count({where: whereOptions});
        const totalPages = Math.ceil(totalRecords / perPage);

        const fertilizanteCalculos = await prisma.fertilizanteCalculos.findMany({
            where: whereOptions,
            include: {
                TipoFertilizante: true,
                sede: true,
            },
            orderBy: [{TipoFertilizante: {nombre: 'asc'}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedFertilizananteCalculos: FertilizanteCalc[] = fertilizanteCalculos.map(
            (fertilizanteCalculo) => formatFertilizanteCalculo(fertilizanteCalculo)
        );

        return NextResponse.json({
            data: formattedFertilizananteCalculos,
            meta: {
                page,
                perPage,
                totalPages,
                totalRecords,
            },
        });

    } catch (error) {
        console.error("Error finding combustion calculations", error);
        return new NextResponse("Error finding combustion calculations", {
            status: 500,
        });
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: FertilizanteCalcRequest = await req.json();
        if (!body) return NextResponse.json([{error: "Missing body"}]);
        const sedeId = body.sedeId;
        const yearFrom = body.from;
        const yearTo = body.to;

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

        console.log(period);

        const whereOptionsFertilizante = {
            sede_id: sedeId,
        } as {
            sede_id: number;
            tipoFertilizante_id?: number;
            anio_id?: number;
        };

        let allYears = [];
        const from = yearFromId ? yearFrom : undefined;
        const to = yearToId ? yearTo : undefined;

        const maxYear = await prisma.anio.findFirst({orderBy: {nombre: 'desc'}});
        const minYear = await prisma.anio.findFirst({orderBy: {nombre: 'asc'}});

        if (from && to) {
            for (let i = Number(yearFrom); i <= Number(yearTo); i++) {
                allYears.push(i.toString());
            }
        } else if (from) {
            if (!maxYear) return new NextResponse("No hay años registrados", {status: 400});
            for (let i = Number(yearFrom); i <= Number(maxYear.nombre); i++) {
                allYears.push(i.toString());
            }
        } else if (to) {
            if (!minYear) return new NextResponse("No hay años registrados", {status: 400});
            for (let i = Number(minYear.nombre); i <= Number(yearTo); i++) {
                allYears.push(i.toString());
            }
        } else {
            if (!minYear || !maxYear) return new NextResponse("No hay años registrados", {status: 400});
            for (let i = Number(minYear.nombre); i <= Number(maxYear.nombre); i++) {
                allYears.push(i.toString());
            }
        }

        const tiposFertilizante = await prisma.tipoFertilizante.findMany();

        await prisma.fertilizanteCalculosDetail.deleteMany({
            where: {
                fertilizanteCalculos: {
                    sedeId: sedeId,
                    periodoCalculoId: period.id,
                }
            },
        })

        await prisma.fertilizanteCalculos.deleteMany({
            where: {
                sedeId: sedeId,
                periodoCalculoId: period.id,
            },
        });

        const gwp = await prisma.gWP.findFirstOrThrow({
            where: {
                formula: "N2O",
            },
        });

        let totalTipoFertilizante = 0;
        let totalCantidadAporte = 0;
        let totalEmisionesDirectas = 0;
        let totalEmisionGEI = 0;


        for (const tipoFertilizante of tiposFertilizante) {
            const tipoFertilizanteCalculo = await prisma.fertilizanteCalculos.create({
                data: {
                    tipofertilizanteId: tipoFertilizante.id,
                    consumoTotal: 0,
                    cantidadAporte: 0,
                    emisionDirecta: 0,
                    totalEmisionesDirectas: 0,
                    emisionGEI: 0,
                    periodoCalculoId: period.id,
                    sedeId: sedeId,
                },
            });

            for (const year of allYears) {
                const anio_id = await getAnioId(year);
                const factorEmisionFertilizante = await prisma.factorEmisionFertilizante.findFirst({where: {anio_id}});
                if (!factorEmisionFertilizante) return new NextResponse(`Agregue el factor de emisión para el año ${year}`, {status: 400});

                let whereOptionsDetails = whereOptionsFertilizante;
                whereOptionsDetails.tipoFertilizante_id = tipoFertilizante.id;
                whereOptionsDetails.anio_id = anio_id;

                const fertilizante = await prisma.fertilizante.findMany({
                    where: whereOptionsDetails,
                });

                const totalConsumoYear: number = fertilizante.reduce((acc, fertilizante) => {
                    return acc + fertilizante.cantidad;
                }, 0);


                const cantidadAporte = tipoFertilizante.porcentajeNitrogeno * totalConsumoYear;
                const emisionDirecta = factorEmisionFertilizante.valor * cantidadAporte / 1000;

                await prisma.fertilizanteCalculosDetail.create({
                    data: {
                        tipofertilizanteId: tipoFertilizante.id,
                        factorEmisionId: factorEmisionFertilizante.id,
                        consumo: totalConsumoYear,
                        cantidadAporte: cantidadAporte,
                        emisionDirecta: emisionDirecta,
                        totalEmisionesDirectas: emisionDirecta,
                        emisionGEI: emisionDirecta * gwp.valor,
                        sedeId: sedeId,
                        fertilizanteCalculosId: tipoFertilizanteCalculo.id,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                totalTipoFertilizante += totalConsumoYear;
                totalCantidadAporte += cantidadAporte;
                totalEmisionesDirectas += emisionDirecta;
                totalEmisionGEI += emisionDirecta * gwp.valor;
            }

            await prisma.fertilizanteCalculos.update({
                where: {id: tipoFertilizanteCalculo.id,},
                data: {
                    consumoTotal: totalTipoFertilizante,
                    cantidadAporte: totalCantidadAporte,
                    emisionDirecta: totalEmisionesDirectas,
                    totalEmisionesDirectas: totalEmisionesDirectas,
                    emisionGEI: totalEmisionGEI,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }

        return NextResponse.json({message: "Cálculo realizado exitosamente"});
    } catch (error) {
        console.error("Error calculating fertilizante", error);
        return new NextResponse("Error calculating fertilizante", {
            status: 500,
        });
    }
}
