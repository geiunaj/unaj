import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";
import {formatConsumoPapelCalculo} from "@/lib/resources/consumoPapelCalculateResource";
import {ConsumoPapelCalculoRequest} from "@/components/consumoPapel/services/consumoPapelCalculate.interface";

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
                consumo.rn = index + 1;
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

        const whereOptionsConsumoPapel = {
            sede_id: sedeId,
        } as {
            tipoPapel_id?: number;
            anio_id?: number;
            sede_id: number;
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

        const tiposPapel = await prisma.tipoPapel.findMany();

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

        let totalTipoPapel = 0;
        let totalConsumo = 0;
        let totalEmisionGEI = 0;

        console.log(tiposPapel);
        console.log(allYears);

        for (const tipoPapel of tiposPapel) {
            if (!tipoPapel.area || !tipoPapel.gramaje || !tipoPapel.porcentaje_reciclado || !tipoPapel.porcentaje_virgen) return new NextResponse(`El tipo de papel ${tipoPapel.nombre} no tiene todos los datos necesarios`, {status: 400});
            const consumoPapelCalculo = await prisma.consumoPapelCalculos.create({
                data: {
                    cantidad: 0,
                    consumo: 0,
                    totalGEI: 0,
                    tipoPapel_id: tipoPapel.id,
                    sede_id: sedeId,
                    period_id: period.id,
                },
            });

            for (const year of allYears) {
                const anioId = await getAnioId(year);
                if (!anioId) return new NextResponse(`El año ${year} no está registrado`, {status: 400});
                const factorTipoPapel = await prisma.factorTipoPapel.findFirst({where: {anioId}});
                if (!factorTipoPapel) return new NextResponse(`Agregue el factor de emisión para el año ${year}`, {status: 400});

                let whereOptionsDetails = whereOptionsConsumoPapel;
                whereOptionsDetails.tipoPapel_id = tipoPapel.id;
                whereOptionsDetails.anio_id = anioId;

                const consumoPapel = await prisma.consumoPapel.findMany({
                    where: whereOptionsDetails,
                });

                const totalConsumoYear: number = consumoPapel.reduce((acc, consumoPapel) => {
                    return acc + consumoPapel.cantidad_paquete;
                }, 0);


                const cantidadUsada = totalConsumoYear * tipoPapel.area * tipoPapel.gramaje;
                const emisionoGEI = cantidadUsada * ((tipoPapel.porcentaje_reciclado / 100 * factorTipoPapel.reciclado) + (tipoPapel.porcentaje_virgen / 100 * factorTipoPapel.virgen)) / 100;

                await prisma.consumoPapelCalculosDetail.create({
                    data: {
                        cantidad: totalConsumoYear,
                        factorTipoPapelId: factorTipoPapel.id,
                        consumo: cantidadUsada,
                        totalGEI: emisionoGEI,
                        consumoPapelCalculosId: consumoPapelCalculo.id,
                        sedeId: sedeId,
                        anioId: anioId,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                totalTipoPapel += totalConsumoYear;
                totalConsumo += cantidadUsada;
                totalEmisionGEI += emisionoGEI;
            }

            await prisma.consumoPapelCalculos.update({
                where: {id: consumoPapelCalculo.id,},
                data: {
                    cantidad: totalTipoPapel,
                    consumo: totalConsumo,
                    totalGEI: totalEmisionGEI,
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
