import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatCategoriaActivo } from "@/lib/resources/categoriaActivoResource";
import {
  CategoriaActivo,
  CategoriaActivoRequest,
} from "@/components/tipoActivo/services/categoriaActivo.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const perPage = parseInt(searchParams.get("perPage") ?? "0");
    const page = parseInt(searchParams.get("page") ?? "1");

    const categoriaActivos = await prisma.categoriaActivo.findMany({
      orderBy: { nombre: "asc" },
      ...(perPage > 0 ? { skip: (page - 1) * perPage, take: perPage } : {}),
    });
    if (perPage > 0) {
      const totalRecords = await prisma.categoriaActivo.count();
      const totalPages = Math.ceil(totalRecords / perPage);
      const categoriaActivoFormatted: any[] = categoriaActivos.map(
        (activo, index) => {
          const newCategoriaActivo = formatCategoriaActivo(activo);
          newCategoriaActivo.rn = (page - 1) * perPage + index + 1;
          return newCategoriaActivo;
        }
      );
      return NextResponse.json({
        data: categoriaActivoFormatted,
        meta: { page, perPage, totalRecords, totalPages },
      });
    }
    const formattedCategoriaActivos: CategoriaActivo[] = categoriaActivos.map(
      formatCategoriaActivo
    );
    return NextResponse.json(formattedCategoriaActivos);
  } catch (error) {
    console.error("Error buscando Categoria de Activos", error);
    return new NextResponse("Error buscando Categoria de Activos", {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: CategoriaActivoRequest = await req.json();
    const GrupoActivo = await prisma.grupoActivo.findUnique({
      where: { id: body.grupoActivoId },
    });
    if (!GrupoActivo) {
      return NextResponse.json(
        { message: "Grupo de Activo no encontrado" },
        { status: 404 }
      );
    }
    const newCategoriaActivo = await prisma.categoriaActivo.create({
      data: {
        nombre: body.nombre,
        grupoActivoId: body.grupoActivoId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      message: "Categoria de Activo creada correctamente",
      categoriaActivo: formatCategoriaActivo(newCategoriaActivo),
    });
  } catch (error) {
    console.error("Error creando Categoria de Activo", error);
    return new NextResponse("Error creando Categoria de Activo", {
      status: 500,
    });
  }
}
