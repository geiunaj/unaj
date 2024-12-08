import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    TipoActivo,
    TipoActivoRequest,
} from "@/components/tipoActivo/services/tipoActivo.interface";
import {formatTipoActivo} from "@/lib/resources/tipoActivoResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");
        const nombre = searchParams.get("nombre") ?? "";
        const tiposActivo = await prisma.tipoActivo.findMany({
            where: {
                nombre: {
                    contains: nombre,
                },
            },
            include: {
                categoria: true,
            },
            orderBy: {id: "desc"},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });
        if (perPage > 0) {
            const totalRecords = await prisma.tipoActivo.count({
                where: {
                    nombre: {
                        contains: nombre,
                    },
                },
            });
            const totalPages = Math.ceil(totalRecords / perPage);
            const tiposActivoFormatted: any[] = tiposActivo.map((activo, index) => {
                const newActivo = formatTipoActivo(activo);
                newActivo.rn = (page - 1) * perPage + index + 1;
                return newActivo;
            });
            return NextResponse.json({
                data: tiposActivoFormatted,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }
        const formattedTipoActivos: TipoActivo[] =
            tiposActivo.map(formatTipoActivo);
        return NextResponse.json(formattedTipoActivos);
    } catch (error) {
        console.error("Error finding tipos de activo", error);
        return NextResponse.json(
            {message: "Error finding tipos de activo"},
            {status: 500}
        );
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TipoActivoRequest = await req.json();
        const tipoActivo = await prisma.tipoActivo.create({
            data: {
                nombre: body.nombre,
                unidad: "kg",
                peso: body.peso,
                fuente: body.fuente,
                costoUnitario: body.costoUnitario,
                categoriaId: body.categoriaId,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Tipo de Activo creado",
            tipoActivo: tipoActivo,
        });
    } catch (error) {
        console.error("Error creating tipo de activo", error);
        return NextResponse.json(
            {message: "Error creating tipo de activo"},
            {status: 500}
        );
    }
}
