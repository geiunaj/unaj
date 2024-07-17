import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const mes = await prisma.mes.findMany();
    return NextResponse.json(mes);
  } catch (error) {
    console.error("Error finding tipos mes", error);
    return new NextResponse("Error finding mes", { status: 500 });
  }
}
