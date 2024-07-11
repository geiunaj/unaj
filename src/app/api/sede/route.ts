import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const sedes = await prisma.sede.findMany();
    return NextResponse.json(sedes);
  } catch (error) {
    console.error("Error finding sedes", error);
    return new NextResponse("Error finding sedes", { status: 500 });
  }
}
