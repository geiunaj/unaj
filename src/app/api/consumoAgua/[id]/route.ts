import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {consumoAguaRequest} from "@/components/consumoAgua/services/consumoAgua.interface";
import {formatConsumoAgua} from "@/lib/resources/consumoAgua.Resource";


// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    console.log(params.id);
    try {
        const id = parseInt(params.id);
        const consumoAgua = await prisma.consumoAgua.findUnique({
            where: {
                id: id,
            },
            include: {
                area: true,
                mes: true,
                anio: true,
            },
        });

        if (!consumoAgua) {
            return new NextResponse("Consumo no encontrado", {status: 404});
        }

        return NextResponse.json(consumoAgua);

    } catch (error) {
        console.error("Error buscando consumo", error);
        return new NextResponse("Error buscando consumo", {status: 500});
    }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const body: consumoAguaRequest = await req.json();

        // VALIDATE BODY
        if (!body.consumo || !body.area_id || !body.mes_id || !body.anio_id || !body.codigoMedidor || !body.fuenteAgua) {
            return new NextResponse("Missing required fields", {status: 400});
        }

        const consumoAgua = await prisma.consumoAgua.update({
            where: {
                id: id,
            },
            data: {
                consumo: body.consumo,
                area_id: body.area_id,
                mes_id: body.mes_id,
                anio_id: body.anio_id,
                updated_at: new Date(),
                codigoMedidor: body.codigoMedidor,
                fuenteAgua: body.fuenteAgua,
            },
            include: {
                area: {
                    include: {
                        sede: true,
                    }
                },
                mes: true,
                anio: true,
            },
        });

        return NextResponse.json({
            message: "Consumo actualizado",
            consumoAgua: formatConsumoAgua(consumoAgua),
        });
    } catch (error) {
        console.error("Error actualizando consumo", error);
        return new NextResponse("Error actualizando consumo", {status: 500});
    }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const consumoAgua = await prisma.consumoAgua.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({
            message: "Consumo eliminado",
        });
    } catch (error) {
        console.error("Error eliminando consumo", error);
        return new NextResponse("Error eliminando consumo", {status: 500});
    }
}
