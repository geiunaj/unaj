import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {TipoConsumible, TipoConsumibleRequest} from "@/components/tipoConsumible/services/tipoConsumible.interface";
import {formatTipoConsumible} from "@/lib/resources/tipoConsumibleResource";
import {formatConsumible} from "@/lib/resources/consumibleResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");
        const nombre = searchParams.get("nombre") ?? "";
        const tiposConsumible = await prisma.tipoConsumible.findMany({
            where: {
                nombre: {
                    contains: nombre,
                }
            },
            include: {
                descripcion: true,
                categoria: true,
                grupo: true,
                proceso: true,
            },
            orderBy: {id: "desc"},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });
        if (perPage > 0) {
            const totalRecords = await prisma.tipoConsumible.count({
                where: {
                    nombre: {
                        contains: nombre,
                    }
                }
            });
            const totalPages = Math.ceil(totalRecords / perPage);
            const tiposConsumibleFormatted: any[] = tiposConsumible.map(
                (consumible, index) => {
                    const newConsumible = formatTipoConsumible(consumible);
                    newConsumible.rn = (page - 1) * perPage + index + 1;
                    return newConsumible;
                }
            );
            return NextResponse.json({
                data: tiposConsumibleFormatted,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }
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