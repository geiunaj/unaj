import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

// INDEX (GET)
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") ?? undefined;
    const email = searchParams.get("email") ?? undefined;
    const typeUserId = searchParams.get("typeUserId") ?? undefined;
    const sedeId = searchParams.get("sedeId") ?? undefined;

    const page = parseInt(searchParams.get("page") ?? "1");
    const perPage = parseInt(searchParams.get("perPage") ?? "10");

    const whereOptions = {
      name: name ? { contains: name } : undefined,
      email: email ? { contains: email } : undefined,
      type_user_id: typeUserId ? parseInt(typeUserId) : undefined,
    };

    const totalRecords = await prisma.user.count({ where: whereOptions });
    const totalPages = Math.ceil(totalRecords / perPage);

    const users = await prisma.user.findMany({
      where: whereOptions,
      include: {
        type_user: true,
        sede: true,
      },
      orderBy: { id: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return NextResponse.json({
      data: users,
      meta: {
        page,
        perPage,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error buscando usuarios", error);
    return new NextResponse("Error buscando usuarios", { status: 500 });
  }
}

// CREATE (POST)
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: Omit<User, "id"> = await req.json();

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        telefono: body.telefono,
        password: hashedPassword,
        sede_id: body.sede_id,
        type_user_id: body.type_user_id,
      },
      include: {
        type_user: true,
      },
    });

    return NextResponse.json({
      message: "Usuario registrado",
      user,
    });
  } catch (error) {
    console.error("Error registrando usuario", error);
    return new NextResponse("Error registrando usuario", { status: 500 });
  }
}
