import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatGrupoActivo } from "@/lib/resources/grupoActivoResource";
import { GrupoActivoRequest } from "@/components/tipoActivo/services/grupoActivo.interface";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return NextResponse.json({ message: "Invalid ID" }, { status: 404 });
    const grupo = await prisma.grupoActivo.findUnique({
      where: {
        id: id,
      },
    });

    if (!grupo)
      return NextResponse.json(
        { message: "Grupo no encontrado" },
        { status: 404 }
      );
    return NextResponse.json(formatGrupoActivo(grupo));
  } catch (error) {
    console.error("Error buscando grupo", error);
    return NextResponse.json(
      { message: "Error buscando grupo" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    const { nombre }: GrupoActivoRequest = await req.json();
    if (!nombre)
      return NextResponse.json(
        { message: "Nombre es requerido" },
        { status: 422 }
      );

    const grupoActivo = await prisma.grupoActivo.update({
      where: {
        id: id,
      },
      data: {
        nombre,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      message: "Grupo actualizado correctamente",
      grupo: formatGrupoActivo(grupoActivo),
    });
  } catch (error) {
    console.error("Error actualizando grupo", error);
    return NextResponse.json(
      { message: "Error actualizando grupo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    const grupo = await prisma.grupoActivo.findUnique({
      where: { id: id },
    });
    if (!grupo)
      return NextResponse.json(
        { message: "Grupo no encontrado" },
        { status: 404 }
      );

    await prisma.grupoActivo.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Grupo eliminado correctamente",
    });
  } catch (error: any) {
    console.error("Error eliminando grupo", error);
    return NextResponse.json(
      { message: "Error eliminando grupo" },
      { status: 500 }
    );
  }
}
