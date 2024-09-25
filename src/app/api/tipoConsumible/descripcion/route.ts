import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatDescripcionConsumible} from "@/lib/resources/descripcionConsumibleResource";
import {
    DescripcionConsumible,
    DescripcionConsumibleRequest
} from "@/components/tipoConsumible/services/descripcionConsumible.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const descripcionConsumibles = await prisma.descripcionConsumible.findMany();
        const formattedDescripcionConsumibles: DescripcionConsumible[] = descripcionConsumibles.map(formatDescripcionConsumible);

        return NextResponse.json(formattedDescripcionConsumibles);
    } catch (error) {
        console.error("Error buscando Descripcion de Consumibles", error);
        return new NextResponse("Error buscando Descripcion de Consumibles", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: DescripcionConsumibleRequest = await req.json();

        const newDescripcionConsumible = await prisma.descripcionConsumible.create({
            data: {
                descripcion: body.descripcion,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Descripcion de Consumible creada correctamente",
            descripcionConsumible: formatDescripcionConsumible(newDescripcionConsumible),
        });
    } catch (error) {
        console.error("Error creando Descripcion de Consumible", error);
        return new NextResponse("Error creando Descripcion de Consumible", {status: 500});
    }
}
