import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  CombustionCalcRequest,
  CombustionCalc,
} from "@/components/combustion/services/combustionCalculate.interface";
import { formatCombustibleCalculo } from "@/lib/resources/combustionCalculateResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const sedeId = searchParams.get("sedeId");
    let anioId = searchParams.get("anioId");
    const tipo = searchParams.get("tipo");

    if (!sedeId || !anioId || !tipo) {
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

    const combustibleCalculos = await prisma.combustibleCalculos.findMany({
      where: {
        sedeId: parseInt(sedeId),
        anioId: searchAnio.id,
        tipo: tipo,
      },
      include: {
        tipoCombustible: true,
        // sede: true,
        // anio: true
      },
    });

    const formattedCombustibleCalculos: any[] = combustibleCalculos.map(
      (combustibleCalculo) => formatCombustibleCalculo(combustibleCalculo)
    );

    return NextResponse.json(formattedCombustibleCalculos);
  } catch (error) {
    console.error("Error finding combustion calculations", error);
    return new NextResponse("Error finding combustion calculations", {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // PRIMERO DEFINO UNA VARIABLE PARA ALMACENAR LOS CALCULOS DE COMBUSTIBLE
    const combustibleCalculos = [];

    // LUEGO OBTENGO EL CUERPO DE LA PETICION QUE DEBE SER DE TIPO CombustionCalcRequest
    const body: CombustionCalcRequest = await req.json();

    // OBTENGO LOS DATOS DE LA PETICION QUE NECESITO PARA REALIZAR LOS CALCULOS COMO
    // EL ID DE LA SEDE, EL ID DEL AÑO Y EL TIPO DE COMBUSTIBLE
    const sedeId = body.sedeId;
    let anioId = body.anioId; // AQUI LE PONGO LET PORQUE LUEGO CAMBIO EL VALOR DE ESTA VARIABLE, YA QUE RECIBO 2024 Y NECESITO EL ID DE ESE AÑO
    const tipo = body.tipo;

    /* 
    findFirst: Busca la primera instancia que cumpla con las condiciones que le paso en el where
    findUnique: Busca una instancia unica que cumpla con las condiciones que le paso en el where
    findMany: Busca todas las instancias que cumplan con las condiciones que le paso
    */

    // AQUI BUSCO EL AÑO QUE ME PASARON EN LA PETICION POR ESO USO prisma.anio.findFirst
    // POR ESO EN EL WHERE LE PASO EL NOMBRE DEL AÑO QUE ME PASARON
    // LE COLOCO .toString() PORQUE EL VALOR QUE ME PASAN NO ES UN STRING Y NECESITO QUE SEA UN STRING
    const searchAnio = await prisma.anio.findFirst({
      where: {
        nombre: anioId.toString(),
      },
    });

    // SI NO ENCUENTRO EL AÑO QUE ME PASARON EN LA PETICION DEVUELVO UN MENSAJE DE ERROR
    if (!searchAnio) {
      return NextResponse.json([{ error: "Anio not found" }]);
    } else {
      // SI ENCUENTRO EL AÑO QUE ME PASARON EN LA PETICION CAMBIO EL VALOR DE LA VARIABLE ANIOID
      anioId = searchAnio.id;
    }

    //
    //
    //
    // A PARTIR DE AQUI EMPIEZO A REALIZAR LOS CALCULOS DE COMBUSTIBLE
    //
    //
    //

    // OBTENGO LOS TIPOS DE COMBUSTIBLE QUE TENGO EN LA BASE DE DATOS, USO prisma.tipoCombustible.findMany
    const tiposCombustible = await prisma.tipoCombustible.findMany();

    // OBTENGO LOS CONSUMOS DE COMBUSTIBLE DE LA SEDE QUE ME PASARON EN LA PETICION, USO prisma.combustible.findMany
    const combustibles = await prisma.combustible.findMany({
      where: {
        // AQUI LE PASO LAS CONDICIONES QUE NECESITO PARA OBTENER LOS CONSUMOS DE COMBUSTIBLE
        sede_id: sedeId,
        anio_id: anioId,
        tipo: tipo,
      },
    });

    // ELIMINO LOS CALCULOS DE COMBUSTIBLE QUE YA ESTAN EN LA BASE DE DATOS
    await prisma.combustibleCalculos.deleteMany({
      where: {
        anioId: anioId,
        sedeId: sedeId,
        tipo: tipo,
      },
    });

    // RECORRO LOS TIPOS DE COMBUSTIBLE QUE OBTUVE DE LA BASE DE DATOS
    for (const tipoCombustible of tiposCombustible) {
      // (1)
      // COMIENZO A REALIZAR LOS CALCULOS DE COMBUSTIBLE

      //   HAGO UNA CONSTANTE PARA ALMACENAR EL CONSUMO TOTAL DE COMBUSTIBLE
      //   EL CONSUMO TOTAL DE COMBUSTIBLE ES LA SUMA DE TODOS LOS CONSUMOS DE COMBUSTIBLE QUE TENGO
      //   EN LA BASE DE DATOS, POR ESO USO EL METODO reduce, QUE ME PERMITE REDUCIR UN ARRAY A UN SOLO VALOR
      const totalConsumo: number = combustibles.reduce((acc, combustible) => {
        // ACC ES EL ACUMULADOR, ES DECIR EL VALOR QUE SE VA ACUMULANDO
        // COMBUSTIBLE ES EL VALOR ACTUAL QUE ESTOY RECORRIENDO DEL ARRAY DE COMBUSTIBLES

        // AQUI PREGUNTO SI EL TIPO DE COMBUSTIBLE DEL CONSUMIBLE QUE ESTOY RECORRIENDO
        // ES IGUAL AL TIPO DE COMBUSTIBLE QUE ESTOY RECORRIENDO EN EL ARRAY DE TIPOS DE COMBUSTIBLE (1)
        if (combustible.tipoCombustible_id === tipoCombustible.id) {
          // SI EL TIPO DE COMBUSTIBLE DEL CONSUMIBLE QUE ESTOY RECORRIENDO
          // ES IGUAL AL TIPO DE COMBUSTIBLE QUE ESTOY RECORRIENDO EN EL ARRAY DE TIPOS DE COMBUSTIBLE
          // SUMO EL CONSUMO DEL CONSUMIBLE AL ACUMULADOR
          return acc + combustible.consumo;
        }

        // FINALMENTE RETORNO EL ACUMULADOR
        return acc;

        // AQUI LE PASO 0 COMO VALOR INICIAL DEL ACUMULADOR
      }, 0);

      // LUEGO ALMACENO EL VALOR CALORICO DEL TIPO DE COMBUSTIBLE QUE ESTOY RECORRIENDO
      const valorCalorico = tipoCombustible.valorCalorico;

      //   Y AHORA SI CALCULO EL CONSUMO DE COMBUSTIBLE QUE ES EL PRODUCTO DEL
      //   VALOR CALORICO POR EL CONSUMO TOTAL DE TODOS LOS CONSUMOS DE COMBUSTIBLE
      const consumo = valorCalorico * totalConsumo;

      // LUEGO CALCULO LAS EMISIONES DE CO2, CH4 Y N2O PARA EL TIPO DE COMBUSTIBLE QUE ESTOY RECORRIENDO
      const totalEmisionCO2: number =
        tipoCombustible.factorEmisionCO2 * consumo;
      const totalEmisionCH4: number =
        tipoCombustible.factorEmisionCH4 * consumo;
      const totalEmisionN2O: number =
        tipoCombustible.factorEmisionN2O * consumo;
      const totalGEI: number =
        totalEmisionCO2 + totalEmisionCH4 + totalEmisionN2O;

      // POR ULTIMO GUARDO LOS CALCULOS DE COMBUSTIBLE EN  UNA VARIABLE DE TIPO CombustionCalc
      const calculoCombustible: CombustionCalc = {
        tipo: tipo,
        tipoCombustibleId: tipoCombustible.id,
        consumoTotal: totalConsumo,
        valorCalorico: valorCalorico,
        consumo: consumo,
        emisionCO2: totalEmisionCO2,
        emisionCH4: totalEmisionCH4,
        emisionN2O: totalEmisionN2O,
        totalGEI: totalGEI,
        anioId: anioId,
        sedeId: sedeId,
      };

      //   AQUI GUARDO LOS CALCULOS DE COMBUSTIBLE EN LA BASE DE DATOS
      const tipoCombustibleCreate = await prisma.combustibleCalculos.create({
        data: calculoCombustible,
        // CONSIDERO EL INCLUDE PARA QUE ME DEVUELVA LOS DATOS DE TIPO COMBUSTIBLE, SEDE Y AÑO SI LO NECESITO
        include: {
          tipoCombustible: true,
          // sede: true,
          // anio: true,
        },
      });

      //   AQUI AGREGO LOS CALCULOS DE COMBUSTIBLE A LA VARIABLE QUE CREE AL PRINCIPIO
      combustibleCalculos.push(tipoCombustibleCreate);
    }

    // AQUI FORMATEO LOS CALCULOS DE COMBUSTIBLE PARA QUE SEAN MAS FACILES DE LEER
    const formattedCombustibleCalculos: any[] = combustibleCalculos.map(
        // AQUI LE PASO CADA CALCULO DE COMBUSTIBLE A LA FUNCION formatCombustibleCalculo
        // PARA QUE ME DEVUELVA LOS DATOS DE UNA FORMA MAS FACIL DE LEER        
      (combustibleCalculo) => formatCombustibleCalculo(combustibleCalculo)
    );

    // POR ULTIMO DEVUELVO LOS CALCULOS DE COMBUSTIBLE FORMATEADOS
    return NextResponse.json(formattedCombustibleCalculos);
  } catch (error) {
    console.error("Error calculating combustion", error);
    return new NextResponse("Error calculating combustion", { status: 500 });
  }
}
