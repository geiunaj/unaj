import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const gwp = await prisma.gWP.findMany();
        return NextResponse.json(gwp);
    } catch (error) {
        console.error("Error al cargar datos", error);
        return new NextResponse("Error finding gwp", {status: 500});
    }
}