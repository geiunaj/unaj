import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatGrupoActivo } from "@/lib/resources/grupoActivoResource";
import {
  GrupoActivo,
  GrupoActivoRequest,
} from "@/components/tipoActivo/services/grupoActivo.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const perPage = parseInt(searchParams.get("perPage") ?? "0");
    const page = parseInt(searchParams.get("page") ?? "1");

    const grupoActivos = await prisma.grupoActivo.findMany({
      orderBy: { nombre: "asc" },
      ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
    });
    if (perPage > 0) {
      const totalRecords = await prisma.grupoActivo.count();
      const totalPages = Math.ceil(totalRecords / perPage);
      const grupoActivoFormatted: any[] = grupoActivos.map((activo, index) => {
        const newGrupoActivo = formatGrupoActivo(activo);
        newGrupoActivo.rn = (page - 1) * perPage + index + 1;
        return newGrupoActivo;
      });
      return NextResponse.json({
        data: grupoActivoFormatted,
        meta: { page, perPage, totalRecords, totalPages },
      });
    }

    const formattedGrupoActivos: GrupoActivo[] =
      grupoActivos.map(formatGrupoActivo);
    return NextResponse.json(formattedGrupoActivos);
  } catch (error) {
    console.error("Error buscando Grupo de Activos", error);
    return NextResponse.json(
      { message: "Error buscando Grupo de Activos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: GrupoActivoRequest = await req.json();

    const newGrupoActivo = await prisma.grupoActivo.create({
      data: {
        nombre: body.nombre,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      message: "Grupo de Activo creado correctamente",
      grupoActivo: formatGrupoActivo(newGrupoActivo),
    });
  } catch (error) {
    console.error("Error creando Grupo de Activo", error);
    return NextResponse.json(
      { message: "Error creando Grupo de Activo" },
      { status: 500 }
    );
  }
}
