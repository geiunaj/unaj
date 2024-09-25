import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {TipoConsumible, TipoConsumibleRequest} from "@/components/tipoConsumible/services/tipoConsumible.interface";
import {formatTipoConsumible} from "@/lib/resources/tipoConsumibleResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const tiposConsumible = await prisma.tipoConsumible.findMany({
            include: {
                descripcion: true,
                categoria: true,
                grupo: true,
                proceso: true,
            }
        });
        const formattedTipoConsumibles: TipoConsumible[] = tiposConsumible.map(formatTipoConsumible);
        return NextResponse.json(formattedTipoConsumibles);
    } catch (error) {
        console.error("Error finding tipos de consumible", error);
        return new NextResponse("Error finding tipos de consumible", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TipoConsumibleRequest = await req.json();
        const tipoConsumible = await prisma.tipoConsumible.create({
            data: {
                nombre: body.nombre,
                unidad: body.unidad,
                descripcionId: body.descripcionId,
                categoriaId: body.categoriaId,
                grupoId: body.grupoId,
                procesoId: body.procesoId,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Tipo de Consumible creado",
            tipoConsumible: tipoConsumible,
        });

    } catch (error) {
        console.error("Error creating tipo de consumible", error);
        return new NextResponse("Error creating tipo de consumible", {status: 500});
    }
}