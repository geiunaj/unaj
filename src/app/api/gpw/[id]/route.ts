import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GPWRequest } from "@/components/gwp/services/gwp.interface";
import { formatGwp } from "@/lib/resources/gwp.Resource";

// SHOW ROUTE -> PARAM [ID]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const gwp = await prisma.gWP.findUnique({
      where: {
        id: id,
      },
    });

    if (!gwp) {
      return new NextResponse("GWP not found", { status: 404 });
    }

    return NextResponse.json(gwp);
  } catch (error) {
    console.error("Error finding GWP", error);
    return new NextResponse("Error finding GWP", { status: 500 });
  }
}

//UPDATE ROUTE -> PARAM [ID]
// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const body = await req.json();

    // Validar los campos requeridos
    const { nombre, formula, valor } = body;
    if (!nombre || !formula || typeof valor !== "number") {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const gwpRequest: GPWRequest = {
      nombre,
      formula,
      valor,
    };

    const gwp = await prisma.gWP.update({
      where: {
        id: id,
      },
      data: gwpRequest,
    });

    return NextResponse.json({
      message: "Registro de GWP actualizado",
      gwp: formatGwp(gwp),
    });
  } catch (error) {
    console.error("Error updating GWP", error);
    return new NextResponse("Error updating GWP", { status: 500 });
  }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const gwp = await prisma.gWP.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Registro de GWP eliminado",
    });
  } catch (error) {
    console.error("Error deleting GWP", error);
    return new NextResponse("Error deleting GWP", { status: 500 });
  }
}
