import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatCategoriaConsumible} from "@/lib/resources/categoriaConsumibleResource";
import {
    CategoriaConsumible,
    CategoriaConsumibleRequest
} from "@/components/tipoConsumible/services/categoriaConsumible.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const categoriaConsumibles = await prisma.categoriaConsumible.findMany({
            orderBy: {nombre: "asc"},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });
        if (perPage > 0) {
            const totalRecords = await prisma.categoriaConsumible.count();
            const totalPages = Math.ceil(totalRecords / perPage);
            const categoriaConsumibleFormatted: any[] = categoriaConsumibles.map(
                (consumible, index) => {
                    const newCategoriaConsumible = formatCategoriaConsumible(consumible);
                    newCategoriaConsumible.rn = index + 1;
                    return newCategoriaConsumible;
                }
            );
            return NextResponse.json({
                data: categoriaConsumibleFormatted,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }
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
