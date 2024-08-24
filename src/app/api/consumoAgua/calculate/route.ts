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

        const period = await prisma.periodoCalculo.findFirst({
            where: {
                fechaInicio: dateFrom ? dateFrom : undefined,
                fechaFin: dateTo ? dateTo : undefined,
            },
        });

        if (!period && all) {
            return new NextResponse("Periodo no encontrado", {status: 404,});
        }

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
            },
            orderBy: [{area: {nombre: "asc"}}],
            ...(all ? {} : {skip: (page - 1) * perPage, take: perPage}),
        });

        const formattedConsumoAguaCalculos: any[] = consumoAguaCalculos
            .map((consumoAguaCalculo: any) => {
                if (consumoAguaCalculo.consumoArea !== 0) {
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

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const consumoAguaCalculos = [];

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

        const areas = await prisma.area.findMany(
            {
                where: {
                    sede_id: sedeId ? Number(sedeId) : undefined,
                },
            }
        );

        const whereOptionsConsumoAgua = {
            area: {sede_id: sedeId ? Number(sedeId) : undefined,},
        } as {
            area: {
                sede_id?: number;
            }
            anio_mes?: {
                gte?: number;
                lte?: number;
            };
        };

        const from = yearFromId && mesFromId ? Number(yearFrom) * 100 + mesFromId : undefined;
        const to = yearToId && mesToId ? Number(yearTo) * 100 + mesToId : undefined;

        if (from && to) {
            whereOptionsConsumoAgua.anio_mes = {gte: from, lte: to,};
        } else if (from) {
            whereOptionsConsumoAgua.anio_mes = {gte: from,};
        } else if (to) {
            whereOptionsConsumoAgua.anio_mes = {lte: to,};
        }

        const consumoAgua = await prisma.consumoAgua.findMany({
            where: whereOptionsConsumoAgua
        });

        await prisma.consumoAguaCalculos.deleteMany({
            where: {
                area: {sede_id: sedeId ? Number(sedeId) : undefined,},
                periodoCalculoId: period.id,
            },
        });

        const factorEmision: number = 0.344;

        for (const area of areas) {
            const totalConsumo: number = consumoAgua.reduce((acc, consumoAgua) => {
                if (consumoAgua.area_id === area.id) {
                    return acc + consumoAgua.consumo;
                }
                return acc;
            }, 0);
            const totalGEI: number = totalConsumo * factorEmision / 1000;
            const calculoConsumoAgua: consumoAguaCalculoRequest = {
                consumoArea: totalConsumo,
                factorEmision: factorEmision,
                totalGEI: totalGEI,
                areaId: area.id,
                periodoCalculoId: period.id,
            };
            const newConsumoAguaCalculo = await prisma.consumoAguaCalculos.create({
                data: {
                    consumoArea: calculoConsumoAgua.consumoArea,
                    factorEmision: calculoConsumoAgua.factorEmision,
                    totalGEI: calculoConsumoAgua.totalGEI,
                    areaId: calculoConsumoAgua.areaId,
                    periodoCalculoId: calculoConsumoAgua.periodoCalculoId,

                    created_at: new Date(),
                    updated_at: new Date(),
                },
                include: {
                    area: {include: {sede: true,}},
                },
            });

            consumoAguaCalculos.push(newConsumoAguaCalculo);
        }
        const formattedConsumoAguaCalculos: any[] = consumoAguaCalculos
            .map((consumoAguaCalculo: any) => {
                if (consumoAguaCalculo.consumoArea !== 0) {
                    return formatConsumoAguaCalculo(consumoAguaCalculo);
                }
                return null;
            })
            .filter((combustibleCalculo) => combustibleCalculo !== null);

        return NextResponse.json(formattedConsumoAguaCalculos);
    } catch (error) {
        console.error("Error calculando consumo de agua", error);
        return new NextResponse("Error calculando consumo de agua", {status: 500,});
    }
}
