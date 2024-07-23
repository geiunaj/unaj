import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    CombustionCalcRequest, CombustionCalc
} from "@/components/combustion/services/combustionCalculate.interface";
import {formatCombustibleCalculo} from "@/lib/resources/combustionCalculateResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId");
        let anioId = searchParams.get("anioId");

        if (!sedeId || !anioId) {
            return NextResponse.json([
                {error: "Missing sedeId or anioId"}
            ]);
        }

        const searchAnio = await prisma.anio.findFirst({
            where: {
                nombre: anioId,
            },
        });

        if (!searchAnio) {
            return NextResponse.json([{error: "Anio not found"}]);
        }

        const combustibleCalculos = await prisma.combustibleCalculos.findMany({
            where: {
                sedeId: parseInt(sedeId),
                anioId: searchAnio.id
            },
            include: {
                tipoCombustible: true,
                // sede: true,
                // anio: true
            }
        });

        const formattedCombustibleCalculos: any[] = combustibleCalculos.map(
            (combustibleCalculo) => formatCombustibleCalculo(combustibleCalculo)
        );

        return NextResponse.json(formattedCombustibleCalculos);
    } catch (error) {
        console.error("Error finding combustion calculations", error);
        return new NextResponse("Error finding combustion calculations", {status: 500});
    }

}


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const combustibleCalculos = [];

        const body: CombustionCalcRequest = await req.json();

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

        const tiposCombustible = await prisma.tipoCombustible.findMany();
        const combustibles = await prisma.combustible.findMany({
            where: {
                sede_id: sedeId,
                anio_id: anioId
            }
        });

        await prisma.combustibleCalculos.deleteMany({where: {anioId: anioId, sedeId: sedeId}});

        for (const tipoCombustible of tiposCombustible) {
            // CALCULAR TOTAL DE CONSUMO DE COMBUSTIBLE POR TIPO DE COMBUSTIBLE
            console.log("tipoCombustible: " + tipoCombustible.id)
            const totalConsumo: number = combustibles.reduce((acc, combustible) => {
                if (combustible.tipoCombustible_id === tipoCombustible.id) {
                    console.log("combustible: " + combustible.tipoCombustible_id)
                    return acc + combustible.consumo;
                }
                return acc;
            }, 0);
            const valorCalorico = tipoCombustible.valorCalorico;
            const consumo = valorCalorico * totalConsumo;

            // CALCULAR EMISIONES DE CO2, CH4, N2O Y GEI
            const totalEmisionCO2: number = tipoCombustible.factorEmisionCO2 * consumo;
            const totalEmisionCH4: number = tipoCombustible.factorEmisionCH4 * consumo;
            const totalEmisionN2O: number = tipoCombustible.factorEmisionN2O * consumo;
            const totalGEI: number = totalEmisionCO2 + totalEmisionCH4 + totalEmisionN2O;

            // GUARDAR CALCULO DE COMBUSTIBLE
            const calculoCombustible: CombustionCalc = {
                tipoCombustibleId: tipoCombustible.id,
                consumoTotal: totalConsumo,
                valorCalorico: valorCalorico,
                consumo: consumo,
                emisionCO2: totalEmisionCO2,
                emisionCH4: totalEmisionCH4,
                emisionN2O: totalEmisionN2O,
                totalGEI: totalGEI,
                anioId: anioId,
                sedeId: sedeId
            };
            const tipoCombustibleCreate = await prisma.combustibleCalculos.create({
                data: calculoCombustible,
                include: {
                    tipoCombustible: true,
                    // sede: true,
                    // anio: true,
                }
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
