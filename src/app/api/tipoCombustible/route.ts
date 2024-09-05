import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {TipoCombustibleRequest} from "@/components/tipoCombustible/services/tipoCombustible.interface";
import {formatTipoPapel} from "@/lib/resources/tipoPapel.resource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const tiposCombustible = await prisma.tipoCombustible.findMany({
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.tipoCombustible.count();
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: tiposCombustible,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(tiposCombustible);
    } catch (error) {
        console.error("Error finding Tipos Combustible", error);
        return new NextResponse("Error finding Tipos Combustible", {status: 500});
    }
}


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TipoCombustibleRequest = await req.json();
        const tipoCombustible = await prisma.tipoCombustible.create({
            data: {
                nombre: body.nombre,
                abreviatura: body.abreviatura,
                unidad: body.unidad,
                // valorCalorico: body.valorCalorico,
                // factorEmisionCO2: body.factorEmisionCO2,
                // factorEmisionCH4: body.factorEmisionCH4,
                // factorEmisionN2O: body.factorEmisionN2O,
                // anio_id: body.anio_id,
                created_at: new Date(),
                updated_at: new Date(),
            },

        });
        return NextResponse.json({
            message: "Tipo de Combustible creado",
            tipoPapel: tipoCombustible,
        });

    } catch (error) {
        console.error("Error creando el Tipo de Combustible", error);
        return new NextResponse("Error creando el Tipo de Combustible", {status: 500});
    }
}