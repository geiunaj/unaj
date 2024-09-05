import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTipoPapel} from "@/lib/resources/tipoPapel.resource";
import {TipoPapelRequest} from "@/components/tipoPapel/services/tipoPapel.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const tiposPapel = await prisma.tipoPapel.findMany({
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.tipoPapel.count();
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: tiposPapel.map(formatTipoPapel),
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(tiposPapel.map(formatTipoPapel));
    } catch (error) {
        console.error("Error al cargar los tipos de Papel", error);
        return new NextResponse("Error finding tipos de Papel", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TipoPapelRequest = await req.json();
        const tipoPapel = await prisma.tipoPapel.create({
            data: {
                nombre: body.nombre,
                ancho: body.ancho,
                largo: body.largo,
                area: body.ancho * body.largo,
                gramaje: body.gramaje,
                unidad_paquete: body.unidad_paquete,
                porcentaje_reciclado: body.porcentaje_reciclado,
                porcentaje_virgen: 100 - body.porcentaje_reciclado,
                nombre_certificado: body.nombre_certificado,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Tipo de papel creado correctamente",
            tipoPapel: formatTipoPapel(tipoPapel),
        });
    } catch (error) {
        console.error("Error al crear Tipo de papel", error);
        return new NextResponse("Error al crear Tipo de papel", {status: 500});
    }
}
