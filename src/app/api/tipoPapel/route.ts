import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTipoPapel} from "@/lib/resources/tipoPapel.resource";
import {TipoPapelRequest} from "@/components/tipoPapel/services/tipoPapel.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const tiposPapel = await prisma.tipoPapel.findMany();
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
                gramaje: body.gramaje,
                unidad_paquete: body.unidad_paquete,
                is_certificado: body.is_certificado,
                is_reciclable: body.is_reciclable,
                porcentaje_reciclado: body.porcentaje_reciclado,
                nombre_certificado: body.nombre_certificado,

                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json(tipoPapel);
    } catch (error) {
        console.error("Error al crear el tipo de papel", error);
        return new NextResponse("Error creating tipo de papel", {status: 500});
    }
}
