import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import { formatTipoCombustible } from "@/lib/resources/tipoCombustible";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    console.log(params.id);
    try {
        const id = parseInt(params.id);
        const tipoCombustible = await prisma.tipoCombustible.findUnique({
            where: {
                id: id,
            },
            
        });

        if (!tipoCombustible) {
            return new NextResponse("Tipo Combustible not found", {status: 404});
        }

        return NextResponse.json(formatTipoCombustible(tipoCombustible));
    } catch (error) {
        console.error("Error finding tipo combustible", error);
        return new NextResponse("Error finding tipo combustible", {status: 500});
    }
}