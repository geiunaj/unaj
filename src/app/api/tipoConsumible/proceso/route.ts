import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatProcesoConsumible} from "@/lib/resources/procesoConsumibleResource";
import {
    ProcesoConsumible,
    ProcesoConsumibleRequest
} from "@/components/tipoConsumible/services/procesoConsumible.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const procesoConsumibles = await prisma.procesoConsumible.findMany({
            orderBy: {nombre: "asc"},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });
        if (perPage > 0) {
            const totalRecords = await prisma.procesoConsumible.count();
            const totalPages = Math.ceil(totalRecords / perPage);
            const procesoConsumibleFormatted: any[] = procesoConsumibles.map(
                (consumible, index) => {
                    const newProcesoConsumible = formatProcesoConsumible(consumible);
                    newProcesoConsumible.rn = index + 1;
                    return newProcesoConsumible;
                }
            );
            return NextResponse.json({
                data: procesoConsumibleFormatted,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }
        const formattedProcesoConsumibles: ProcesoConsumible[] = procesoConsumibles.map(formatProcesoConsumible);
        return NextResponse.json(formattedProcesoConsumibles);
    } catch (error) {
        console.error("Error buscando Proceso de Consumibles", error);
        return new NextResponse("Error buscando Proceso de Consumibles", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: ProcesoConsumibleRequest = await req.json();

        const newProcesoConsumible = await prisma.procesoConsumible.create({
            data: {
                nombre: body.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Proceso de Consumible creada correctamente",
            procesoConsumible: formatProcesoConsumible(newProcesoConsumible),
        });
    } catch (error) {
        console.error("Error creando Proceso de Consumible", error);
        return new NextResponse("Error creando Proceso de Consumible", {status: 500});
    }
}
