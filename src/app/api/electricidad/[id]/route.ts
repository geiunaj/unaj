import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {electricidadRequest} from "@/components/consumoElectricidad/services/electricidad.interface";
import {formatElectricidad} from "@/lib/resources/electricidadResource";

// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    console.log(params.id);
    try {
        const id = parseInt(params.id);
        const electricidad = await prisma.consumoEnergia.findUnique({
            where: {
                id: id,
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

        if (!electricidad) {
            return new NextResponse("Electricidad not found", {status: 404});
        }

        return NextResponse.json(electricidad);

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
        const body: electricidadRequest = await req.json();

        // VALIDATE BODY
        if (!body.consumo || !body.area_id || !body.mes_id || !body.anio_id || !body.numeroSuministro) {
            return new NextResponse("Missing required fields", {status: 400});
        }

        const electricidad = await prisma.consumoEnergia.update({
            where: {
                id: id,
            },
            data: {
                consumo: body.consumo,
                areaId: body.area_id,
                numeroSuministro: body.numeroSuministro,
                mes_id: body.mes_id,
                anio_id: body.anio_id,
                updated_at: new Date(),
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
            electricidad: formatElectricidad(electricidad),
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
        const electricidad = await prisma.consumoEnergia.delete({
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
