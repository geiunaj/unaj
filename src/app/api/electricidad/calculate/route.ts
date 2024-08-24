import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    CombustionCalcRequest,
} from "@/components/combustion/services/combustionCalculate.interface";
import {
    ElectricidadCalcRequest,
    electricidadCalculosRequest
} from "@/components/consumoElectricidad/services/electricidadCalculos.interface";
import {formatElectricidadCalculo} from "@/lib/resources/electricidadCalculateResource";
import {getAnioId} from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId");
        const anio = searchParams.get("anio");

        const sort = searchParams.get("sort") ?? undefined;
        const direction = searchParams.get("direction") ?? undefined;

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        let anioId;

        if (anio) {
            const searchAnio = await prisma.anio.findFirst({
                where: {
                    nombre: anio,
                },
            });
            if (!searchAnio) return NextResponse.json([{error: "Anio not found"}]);
            anioId = searchAnio.id;
        }
        if (!sedeId || !anioId) return NextResponse.json([{error: "Missing sedeId or anioId"}]);

        const whereOptions = {
            area: {
                sede_id: parseInt(sedeId),
            },
            anioId: anioId,
        };

        const totalRecords = await prisma.energiaCalculos.count({
            where: whereOptions
        });
        const totalPages = Math.ceil(totalRecords / perPage);

        const electricidadCalculos = await prisma.energiaCalculos.findMany({
            where: {
                area: {
                    sede_id: parseInt(sedeId),
                },
                anioId: anioId,
            },
            include: {
                area: {
                    include: {
                        sede: true
                    }
                },
                anio: true,
                factor: true,
            },
            orderBy: sort
                ? [{[sort]: direction || 'desc'}]
                : [
                    {anioId: 'desc'},
                ],
            skip: (page - 1) * perPage,
            take: perPage,
        });

        const formattedElectricidadCalculos: any[] = electricidadCalculos
            .map((electricidadCalculo: any) => {
                if (electricidadCalculo.consumo !== 0) {
                    return formatElectricidadCalculo(electricidadCalculo);
                }
                return null;
            })
            .filter((combustibleCalculo) => combustibleCalculo !== null);

        return NextResponse.json({
            data: formattedElectricidadCalculos,
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
        const electricidadCalculos = [];

        const body: ElectricidadCalcRequest = await req.json();

        const sedeId = body.sedeId;
        let anioId = await getAnioId(body.anio.toString());
        if (!anioId) return NextResponse.json([{error: "Anio not found"}]);
        const areas = await prisma.area.findMany(
            {
                where: {
                    sede_id: sedeId,
                },
            }
        );

        const electricidad = await prisma.consumoEnergia.findMany({
            where: {
                area: {sede_id: sedeId,},
                anio_id: anioId,
            },
        });

        await prisma.energiaCalculos.deleteMany({
            where: {
                area: {sede_id: sedeId,},
                anioId: anioId,
            },
        });

        const factorSEIN = await prisma.factorConversionSEIN.findFirst({
            where: {
                anioId: anioId,
            },
        });

        if (!factorSEIN) return NextResponse.json([{error: "Factor SEIN not found"}]);

        const factorConversion: number = 277.7778;

        for (const area of areas) {
            const totalConsumo: number = electricidad.reduce((acc, electricidad) => {
                if (electricidad.areaId === area.id) {
                    return acc + electricidad.consumo;
                }
                return acc;
            }, 0);
            const consumo = factorConversion * totalConsumo;
            const totalEmisionCO2: number =
                factorSEIN.factorCO2 * consumo;
            const totalEmisionCH4: number =
                factorSEIN.factorCH4 * consumo;
            const totalEmisionN2O: number =
                factorSEIN.factorN2O * consumo;
            const totalGEI: number =
                totalEmisionCO2 + totalEmisionCH4 + totalEmisionN2O;
            const calculoElectricidad: electricidadCalculosRequest = {
                areaId: area.id,
                consumoTotal: totalConsumo,
                factorConversion: factorConversion,
                consumo: consumo,
                emisionCO2: totalEmisionCO2,
                emisionCH4: totalEmisionCH4,
                emisionN2O: totalEmisionN2O,
                totalGEI: totalGEI,
                anioId: anioId,
            };
            const electridadCalculoCreate = await prisma.energiaCalculos.create({
                data: {
                    consumoArea: calculoElectricidad.consumo,
                    factorConversion: calculoElectricidad.factorConversion,
                    factorId: factorSEIN.id,
                    consumoTotal: calculoElectricidad.consumoTotal,
                    emisionCO2: calculoElectricidad.emisionCO2,
                    emisionCH4: calculoElectricidad.emisionCH4,
                    emisionN2O: calculoElectricidad.emisionN2O,
                    totalGEI: calculoElectricidad.totalGEI,
                    areaId: calculoElectricidad.areaId,
                    anioId: calculoElectricidad.anioId,

                    created_at: new Date(),
                    updated_at: new Date(),
                },
                include: {
                    area: {include: {sede: true,}},
                    anio: true,
                    factor: true
                },
            });

            electricidadCalculos.push(electridadCalculoCreate);
        }

        const formattedElectricidadCalculos: any[] = electricidadCalculos.map(formatElectricidadCalculo);
        return NextResponse.json(formattedElectricidadCalculos);
    } catch (error) {
        console.error("Error calculating combustion", error);
        return new NextResponse("Error calculating combustion", {status: 500});
    }
}
