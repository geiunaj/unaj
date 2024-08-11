import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const anio = await prisma.anio.findMany();
        return NextResponse.json(anio);
    } catch (error) {
        console.error("Error finding tipos años", error);
        return new NextResponse("Error finding años", {status: 500});
    }
}