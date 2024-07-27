import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import { formatFertilizanteCalculo } from "@/lib/resources/combustionFertilizanteResource";
import { FertilizanteCalcRequest } from "@/components/fertilizantes/services/fertilizanteCalculate.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId");
        let anioId = searchParams.get("anioId");

        if (!sedeId || !anioId ) {
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

        const fertilizanteCalculos = await prisma.fertilizanteCalculos.findMany({
            where: {
                sedeId: parseInt(sedeId),
                anioId: searchAnio.id,
            },
            include: {
                fertilizante: true,
                sede: true,
                anio: true
            }
        });

        const formattedFertilizanteCalculos: any[] = fertilizanteCalculos.map(
            (fertilizanteCalculos) => formatFertilizanteCalculo(fertilizanteCalculos)
        );

        return NextResponse.json(formattedFertilizanteCalculos);
    } catch (error) {
        console.error("Error finding combustion calculations", error);
        return new NextResponse("Error finding combustion calculations", {status: 500});
    }

}



export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: FertilizanteCalcRequest = await req.json();

    const { sedeId, anioId, fertilizanteId, cantidad, factorEmisionId } = body;

    // Buscar fertilizante
    const fertilizante = await prisma.fertilizante.findUnique({
      where: { id: fertilizanteId },
      include: {
        tipoFertilizante: true,
      },
    });

    if (!fertilizante || !fertilizante.tipoFertilizante) {
      return NextResponse.json({ error: 'Fertilizante o tipo de fertilizante no encontrado' }, { status: 404 });
    }

    const { tipoFertilizante } = fertilizante;
    const { porcentajeNitrogeno } = tipoFertilizante;

    // Calcular cantidad de aporte de N (C)
    const cantidadAporte = (cantidad * porcentajeNitrogeno) / 100;

    // Buscar factor de emisión
    const factorEmision = await prisma.factorEmision.findUnique({
      where: { id: factorEmisionId },
    });

    if (!factorEmision) {
      return NextResponse.json({ error: 'Factor de emisión no encontrado' }, { status: 404 });
    }

    // Calcular emisiones directas (E) y total de emisiones directas (F)
    const emisionDirecta = (cantidadAporte * factorEmision.valor) / 1000;
    const totalEmisionesDirectas = emisionDirecta;

    // Calcular emisiones GEI (G)
    const GWP_N2O = 298; // Valor de GWP para N2O
    const emisionGEI = totalEmisionesDirectas * GWP_N2O;

    // Guardar cálculo en la base de datos
    const fertilizanteCalculo = await prisma.fertilizanteCalculos.create({
      data: {
        fertilizanteId,
        cantidadAporte,
        factorEmisionId: factorEmision.id,
        emisionDirecta,
        totalEmisionesDirectas,
        emisionGEI,
        anioId,
        sedeId,
      },
      include: {
        fertilizante: {
          include: {
            tipoFertilizante: true,
          },
        },
        factorEmision: true,
        anio: true,
        sede: true,
      },
    });

    // Formatear respuesta
    const formattedResponse = {
      ...formatFertilizanteCalculo(fertilizanteCalculo),
      factorEmision: factorEmision.valor,
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error calculating fertilizer emissions:', error);
    return NextResponse.json({ error: 'Error calculating fertilizer emissions' }, { status: 500 });
  }
}

