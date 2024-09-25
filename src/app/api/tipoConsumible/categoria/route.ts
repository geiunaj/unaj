import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatCategoriaConsumible} from "@/lib/resources/categoriaConsumibleResource";
import {
    CategoriaConsumible,
    CategoriaConsumibleRequest
} from "@/components/tipoConsumible/services/categoriaConsumible.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const categoriaConsumibles = await prisma.categoriaConsumible.findMany();
        const formattedCategoriaConsumibles: CategoriaConsumible[] = categoriaConsumibles.map(formatCategoriaConsumible);

        return NextResponse.json(formattedCategoriaConsumibles);
    } catch (error) {
        console.error("Error buscando Categoria de Consumibles", error);
        return new NextResponse("Error buscando Categoria de Consumibles", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: CategoriaConsumibleRequest = await req.json();

        const newCategoriaConsumible = await prisma.categoriaConsumible.create({
            data: {
                nombre: body.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Categoria de Consumible creada correctamente",
            categoriaConsumible: formatCategoriaConsumible(newCategoriaConsumible),
        });
    } catch (error) {
        console.error("Error creando Categoria de Consumible", error);
        return new NextResponse("Error creando Categoria de Consumible", {status: 500});
    }
}
