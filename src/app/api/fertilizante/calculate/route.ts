import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    FertilizanteCalc,
    FertilizanteCalcRequest,
} from "@/components/fertilizantes/services/fertilizanteCalculate.interface";
import {formatFertilizanteCalculo} from "@/lib/resources/fertilizanteCalculateResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);

        const sedeId = searchParams.get("sedeId");
        const tipoFertilizanteId = searchParams.get("tipoFertilizanteId") ?? undefined;
        const claseFertilizante = searchParams.get("claseFertilizante") ?? undefined;

        
        // let anioId = searchParams.get("anioId");

        const all = searchParams.get("all") === "true";
        const yearFrom = searchParams.get("yearFrom") ?? undefined;
        const yearTo = searchParams.get("yearTo") ?? undefined;

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        let yearFromId: number | undefined;
        let yearToId: number | undefined;

        if (yearFrom) yearFromId = parseInt(yearFrom);
        if (yearTo) yearToId = parseInt(yearTo);


        // if (!sedeId || !anioId) {
        //     return NextResponse.json([{error: "Missing sedeId or anioId"}]);
        // }

        // const searchAnio = await prisma.anio.findFirst({
        //     where: {
        //         nombre: anioId,
        //     },
        // });

        // if (!searchAnio) {
        //     return NextResponse.json([{error: "Anio not found"}]);
        // }

        const whereOptions = {
            sede_id: sedeId ? parseInt(sedeId) : undefined,
            tipoFertilizante_id: tipoFertilizanteId
                ? parseInt(tipoFertilizanteId)
                : undefined,
                tipoFertilizante: {
                    clase: claseFertilizante ? claseFertilizante : undefined,
                },
                anio: {
                    nombre: {
                        ...(yearFromId && yearToId ? {gte: yearFrom, lte: yearTo} :
                                yearFromId ? {gte: yearFrom} : yearToId ? {lte: yearTo} : undefined
                        ),
                    }
                }
            };

        const totalRecords = await prisma.fertilizante.count({where: whereOptions});
        const totalPages = Math.ceil(totalRecords / perPage);

        const fertilizanteCalculos = await prisma.fertilizanteCalculos.findMany({
            where: whereOptions,
            include: {
                TipoFertilizante: true,
                sede: true,
                anio: true,
            },           
        });

        const formattedFertilizananteCalculos: FertilizanteCalc[] = fertilizanteCalculos.map(
            (fertilizanteCalculo) => formatFertilizanteCalculo(fertilizanteCalculo)
        );

        // const formattedFertilizanteCalculos: any[] = fertilizanteCalculos.map(
        //     (fertilizanteCalculos) => formatFertilizanteCalculo(fertilizanteCalculos)
        // );

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
        const fertilizanteCalculos = [];
        const body: FertilizanteCalcRequest = await req.json();

        if (!body) {
            return NextResponse.json([{error: "Missing body"}]);
        }

        console.log("body: " + JSON.stringify(body));

        const sedeId = body.sedeId;
        let anioId = body.anioId;

        const searchAnio = await prisma.anio.findFirst({
            where: {
                nombre: anioId.toString(),
            },
        });

        if (!searchAnio) {
            return NextResponse.json([{error: "Anio not found"}]);
        } else {
            anioId = searchAnio.id;
        }

        const tiposFertilizante = await prisma.tipoFertilizante.findMany();
        const fertilizante = await prisma.fertilizante.findMany({
            where: {
                sede_id: sedeId,
                anio_id: anioId,
            },
        });

        await prisma.fertilizanteCalculos.deleteMany({
            where: {anioId: anioId, sedeId: sedeId},
        });

        const gwp = await prisma.gWP.findFirstOrThrow({
            where: {
                formula: "N2O",
            },
        });

        for (const tipoFertilizante of tiposFertilizante) {
            const totalConsumo: number = fertilizante.reduce((acc, fertilizante) => {
                if (fertilizante.tipoFertilizante_id === tipoFertilizante.id) {
                    return acc + fertilizante.cantidad;
                }
                return acc;
            }, 0);

            console.log(
                "totalConsumo de " + tipoFertilizante.nombre + ": " + totalConsumo
            );

            //CONSTANTES PARA CALCULAR EMISIONES
            const porcentajeNitrogeno = tipoFertilizante.porcentajeNitrogeno;
            const consumo = porcentajeNitrogeno * totalConsumo;
            const factorEmision = 0.0125;

            // CALCULAR EMISIONESFDIRECTAS
            const emisionDirecta = factorEmision * consumo;
            const totalEmisionesDirectas = emisionDirecta;
            const emisionGEI = totalEmisionesDirectas * gwp.valor;

            // GUARDAR CALCULO DE COMBUSTIBLE
            const calculoFertilizante: FertilizanteCalc = {
                tipofertilizanteId: tipoFertilizante.id,
                consumoTotal: totalConsumo,
                cantidadAporte: consumo,
                emisionDirecta: emisionDirecta,
                totalEmisionesDirectas: totalEmisionesDirectas,
                // porcentajeNitrogeno: porcentajeNitrogeno,
                emisionGEI: emisionGEI,
                anioId: anioId,
                sedeId: sedeId,
            };

            const tipoFertilizanteCreate = await prisma.fertilizanteCalculos.create({
                data: calculoFertilizante,
                include: {
                    TipoFertilizante: true,
                    // sede: true,
                    // anio: true,
                },
            });
            fertilizanteCalculos.push(tipoFertilizanteCreate);
        }

        const formattedFertilizanteCalculos: any[] = fertilizanteCalculos.map(
            (fertilizanteCalculo) => formatFertilizanteCalculo(fertilizanteCalculo)
        );

        return NextResponse.json(formattedFertilizanteCalculos);
    } catch (error) {
        console.error("Error calculating fertilizante", error);
        return new NextResponse("Error calculating fertilizante", {
            status: 500,
        });
    }
}
