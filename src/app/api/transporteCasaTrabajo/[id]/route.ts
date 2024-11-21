import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTransporteCasaTrabajo} from "@/lib/resources/transporteCasaTrabajoResource";
import {
    TransporteCasaTrabajoRequest
} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajo.interface";

// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const TransporteCasaTrabajo = await prisma.casaTrabajo.findUnique({
            where: {
                id: id,
            },
            include: {
                tipoVehiculo: true,
                mes: true,
                anio: true,
                sede: true,
            },
        });

        if (!TransporteCasaTrabajo) {
            return NextResponse.json({message: "Transporte Casa Trabajo no encontrado"}, {status: 404});
        }
        return NextResponse.json(formatTransporteCasaTrabajo(TransporteCasaTrabajo));
    } catch (error) {
        console.error("Error buscando Transporte Casa Trabajo", error);
        return NextResponse.json({message: "Error buscando Transporte Casa Trabajo"}, {status: 500});
    }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const body: TransporteCasaTrabajoRequest = await req.json();
        const anio = await prisma.anio.findFirst({
            where: {id: body.anioId},
        });
        if (!anio) return NextResponse.json({message: "Año no encontrado"}, {status: 404});
        const tipoVehiculo = await prisma.tipoVehiculo.findFirst({
            where: {id: body.tipoVehiculoId},
        });
        if (!tipoVehiculo) return NextResponse.json({message: "Tipo de Vehiculo no encontrado"}, {status: 404});
        const TransporteCasaTrabajo = await prisma.casaTrabajo.update({
            where: {
                id: id,
            },
            data: {
                tipo: body.tipo,
                tipoVehiculoId: body.tipoVehiculoId,
                kmRecorrido: body.kmRecorrido,
                sedeId: body.sedeId,
                anioId: body.anioId,
                mesId: body.mesId,
                anio_mes: Number(anio.nombre) * 100 + Number(body.mesId),
                updated_at: new Date(),
            },
            include: {
                tipoVehiculo: true,
                mes: true,
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Transporte Casa Trabajo actualizado",
            TransporteCasaTrabajo: formatTransporteCasaTrabajo(TransporteCasaTrabajo),
        });

    } catch (error) {
        console.error("Error actualizando Transporte Casa Trabajo", error);
        return NextResponse.json("Error actualizando Transporte Casa Trabajo", {status: 500});
    }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        await prisma.casaTrabajo.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({
            message: "Transporte Casa Trabajo eliminado",
        });
    } catch (error) {
        console.error("Error eliminando Transporte Casa Trabajo", error);
        return NextResponse.json({message: "Error eliminando Transporte Casa Trabajo"}, {status: 500});
    }
}
