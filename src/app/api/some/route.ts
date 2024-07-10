import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta sea correcta

export async function GET() {
  try {
    // Encuentra todos los usuarios
    const users = await prisma.user.findUnique({
      where: {
        email: "admin@example.com",
      },
    });
    // Devuelve los usuarios como respuesta JSON
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error finding users:", error);
    return new NextResponse("Error finding users", { status: 500 });
  }
}
