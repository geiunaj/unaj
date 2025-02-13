import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatfactorEmisionSEIN } from "@/lib/resources/factorEmisionSEIN.Resource";
import { TaxiFactorRequest } from "@/components/taxiFactor/services/TaxiFactor.interface";
import { formatTaxiFactor } from "@/lib/resources/taxiFactor.resource";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const anioId = searchParams.get("anioId");
    const perPage = parseInt(searchParams.get("perPage") ?? "0");
    const page = parseInt(searchParams.get("page") ?? "1");

    const whereOptions = anioId ? { anio_id: parseInt(anioId) } : {};
    const factoresTransporte = await prisma.factorEmisionTaxi.findMany({
      where: whereOptions,
      include: { anio: true },
      orderBy: [{ anio: { nombre: "desc" } }],
      ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
    });

    if (perPage > 0) {
      const totalRecords = await prisma.factorEmisionTaxi.count({
        where: whereOptions,
      });
      const totalPages = Math.ceil(totalRecords / perPage);
      return NextResponse.json({
        data: factoresTransporte.map(formatTaxiFactor),
        meta: { page, perPage, totalRecords, totalPages },
      });
    }

    return NextResponse.json(factoresTransporte.map(formatTaxiFactor));
  } catch (error) {
    console.error("Error buscando Factores de Taxi", error);
    return new NextResponse("Error buscando Factores de Taxi", {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: TaxiFactorRequest = await req.json();
    const factorExistente = await prisma.factorEmisionTaxi.findFirst({
      where: {
        anio_id: body.anioId,
      },
    });
    if (factorExistente) {
      return new NextResponse("Ya existe un factor de Taxi para este año", {
        status: 400,
      });
    }
    const factorEmisionTaxi = await prisma.factorEmisionTaxi.create({
      data: {
        factor: body.factor,
        anio_id: body.anioId,
        fuente: body.fuente,
        link: body.link,
      },
    });

    return NextResponse.json({
      message: "Factor De Taxi Creado",
      factorEmisionTaxi,
    });
  } catch (error) {
    console.error("Error creando el Factor de Taxi", error);
    return new NextResponse("Error creando el Factor de Taxi", { status: 500 });
  }
}
