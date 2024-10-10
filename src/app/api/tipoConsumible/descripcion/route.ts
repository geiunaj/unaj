import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatDescripcionConsumible} from "@/lib/resources/descripcionConsumibleResource";
import {
    DescripcionConsumibleRequest
} from "@/components/tipoConsumible/services/descripcionConsumible.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");
        
        const descripcionConsumibles = await prisma.descripcionConsumible.findMany({
            orderBy: {descripcion: "asc"},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });
        if (perPage > 0) {
            const totalRecords = await prisma.descripcionConsumible.count();
            const totalPages = Math.ceil(totalRecords / perPage);
            const descripcionConsumibleFormatted: any[] = descripcionConsumibles.map(
                (consumible, index) => {
                    const newDescripcionConsumible = formatDescripcionConsumible(consumible);
                    newDescripcionConsumible.rn = index + 1;
                    return newDescripcionConsumible;
                }
            );
            return NextResponse.json({
                data: descripcionConsumibleFormatted,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }
        const formattedTipoConsumibles = descripcionConsumibles.map(formatDescripcionConsumible);
        return NextResponse.json(formattedTipoConsumibles);
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
