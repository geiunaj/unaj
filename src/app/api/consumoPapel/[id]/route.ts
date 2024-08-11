import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatConsumoPapel} from "@/lib/resources/papelResource";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    console.log(params.id);
    try {
        const id = parseInt(params.id);
        const consumoPapel = await prisma.consumoPapel.findUnique({
            where: {
                id: id,
            },
            include: {
                tipoPapel: true,
                sede: true,
                anio: true,
            },
        });

        if (!consumoPapel) {
            return new NextResponse("ConsumoPapel not found", {status: 404});
        }

        return NextResponse.json(formatConsumoPapel(consumoPapel));
    } catch (error) {
        console.error("Error finding combustible", error);
        return new NextResponse("Error finding combustible", {status: 500});
    }
}