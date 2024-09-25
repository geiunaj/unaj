import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatGrupoConsumible} from "@/lib/resources/grupoConsumibleResource";
import {
    GrupoConsumible,
    GrupoConsumibleRequest
} from "@/components/tipoConsumible/services/grupoConsumible.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const grupoConsumibles = await prisma.grupoConsumible.findMany();
        const formattedGrupoConsumibles: GrupoConsumible[] = grupoConsumibles.map(formatGrupoConsumible);

        return NextResponse.json(formattedGrupoConsumibles);
    } catch (error) {
        console.error("Error buscando Grupo de Consumibles", error);
        return new NextResponse("Error buscando Grupo de Consumibles", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: GrupoConsumibleRequest = await req.json();

        const newGrupoConsumible = await prisma.grupoConsumible.create({
            data: {
                nombre: body.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Grupo de Consumible creada correctamente",
            grupoConsumible: formatGrupoConsumible(newGrupoConsumible),
        });
    } catch (error) {
        console.error("Error creando Grupo de Consumible", error);
        return new NextResponse("Error creando Grupo de Consumible", {status: 500});
    }
}
