import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  FertilizanteCalc,
  FertilizanteCalcRequest,
} from "@/components/fertilizantes/services/fertilizanteCalculate.interface";
import { formatFertilizanteCalculo } from "@/lib/resources/fertilizanteCalculateResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const sedeId = searchParams.get("sedeId");
    let anioId = searchParams.get("anioId");

    if (!sedeId || !anioId) {
      return NextResponse.json([{ error: "Missing sedeId or anioId" }]);
    }

    const searchAnio = await prisma.anio.findFirst({
      where: {
        nombre: anioId,
      },
    });

    if (!searchAnio) {
      return NextResponse.json([{ error: "Anio not found" }]);
    }

    const fertilizanteCalculos = await prisma.fertilizanteCalculos.findMany({
      where: {
        sedeId: parseInt(sedeId),
        anioId: searchAnio.id,
      },
      include: {
        TipoFertilizante: true,
        sede: true,
        anio: true,
      },
    });

    const formattedFertilizanteCalculos: any[] = fertilizanteCalculos.map(
      (fertilizanteCalculos) => formatFertilizanteCalculo(fertilizanteCalculos)
    );

    return NextResponse.json(formattedFertilizanteCalculos);
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

    const sedeId = body.sedeId;
    let anioId = body.anioId;

    const searchAnio = await prisma.anio.findFirst({
      where: {
        nombre: anioId.toString(),
      },
    });

    if (!searchAnio) {
      return NextResponse.json([{ error: "Anio not found" }]);
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
      where: { anioId: anioId, sedeId: sedeId },
    });

    for (const tipoFertilizante of tiposFertilizante) {
      // CALCULAR TOTAL DE CONSUMO DE COMBUSTIBLE POR TIPO DE COMBUSTIBLE
      console.log("tipoFertilizante: " + tipoFertilizante.id);
      const totalConsumo: number = fertilizante.reduce((acc, fertilizante) => {
        if (fertilizante.tipoFertilizante_id === tipoFertilizante.id) {
          console.log("fertilizante: " + fertilizante.tipoFertilizante_id);
          return acc + fertilizante.cantidad;
        }
        return acc;
      }, 0);

      //CONSTANTES PARA CALCULAR EMISIONES
      const porcentajeNitrogeno = tipoFertilizante.porcentajeNitrogeno;
      const consumo = porcentajeNitrogeno * totalConsumo;
      const factorEmision = 0.0125;

      const gwp = await prisma.gWP.findFirst({
        where: { formula: "N20" },
      });

      if (!gwp) {
        console.log(`No se encontró GWP para la fórmula "N20"`);
        continue;
      }

      // CALCULAR EMISIONESFDIRECTAS
      const emisionDirecta = factorEmision * consumo;
      const totalEmisionesDirectas = emisionDirecta;
      const emisionGEI = totalEmisionesDirectas * gwp.valor;

      // GUARDAR CALCULO DE COMBUSTIBLE
      const calculoFertilizante: FertilizanteCalc = {
        tipofertilizanteId: tipoFertilizante.id,
        consumoTotal: totalConsumo,
        cantidadAporte: consumo,
        porcentajeNitrogeno: porcentajeNitrogeno,
        emisionDirecta: emisionDirecta,
        totalEmisionesDirectas: totalEmisionesDirectas,
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
      (fertilizanteeCalculo) => formatFertilizanteCalculo(fertilizanteeCalculo)
    );

    return NextResponse.json(formatFertilizanteCalculo);
  } catch (error) {
    console.error("Error calculating combustion", error);
    return new NextResponse("Error calculating combustion", { status: 500 });
  }
}
