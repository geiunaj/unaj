import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TipoCombustibleRequest } from "@/components/tipoCombustible/services/tipoCombustible.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const tiposCombustible = await prisma.tipoCombustible.findMany();
    return NextResponse.json(tiposCombustible);
  } catch (error) {
    console.error("Error finding Tipos Combustible", error);
    return new NextResponse("Error finding Tipos Combustible", { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: TipoCombustibleRequest = await req.json();
    const tipoCombustible = await prisma.tipoCombustible.create({ 
      data: {
        nombre: body.nombre,
        abreviatura: body.abreviatura,
        unidad: body.unidad,
        valorCalorico: body.valorCalorico,
        factorEmisionCO2: body.factorEmisionCO2,
        factorEmisionCH4: body.factorEmisionCH4,
        factorEmisionN2O: body.factorEmisionN2O,
        created_at: new Date(),
        updated_at: new Date(),
      },

     });
    return NextResponse.json(tipoCombustible, { status: 201 });
    
  } catch (error) {
    console.error("Error creating tipoCombustible", error);
    return new NextResponse("Error creating tipoCombustible", { status: 500 });
  }
}