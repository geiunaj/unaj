import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        // Obtener las clases únicas de la tabla TipoFertilizante
        const clases = await prisma.tipoFertilizante.findMany({
            select: {
                clase: true,
            },
            distinct: ['clase'],
        });

        // Formatear el resultado en un objeto con atributo 'nombre'
        const clasesFormatted = clases.map((tipo) => ({
            nombre: tipo.clase,
        }));

        return NextResponse.json(clasesFormatted);
    } catch (error) {
        console.error("Error al obtener las clases de fertilizantes", error);
        return new NextResponse("Error al obtener las clases de fertilizantes", { status: 500 });
    }
}




