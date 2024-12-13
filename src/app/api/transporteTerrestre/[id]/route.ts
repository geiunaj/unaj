import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {TransporteAereoRequest} from "@/components/transporteAereo/service/transporteAereo.interface";
import {formatTransporteAereo} from "@/lib/resources/transporteAereoResource";

// SHOW ROUTE -> PARAM [ID]
export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", {status: 400});
        }

        const transporteAereo = await prisma.transporteAereo.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
                sede: true,
                mes: true,
                File: true,
            },
        });

        if (!transporteAereo) {
            return new NextResponse("TransporteAereo not found", {status: 404});
        }

        return NextResponse.json(formatTransporteAereo(transporteAereo));
    } catch (error) {
        console.error("Error finding transporteAereo", error);
        return new NextResponse("Error finding transporteAereo", {status: 500});
    }
}

// UPDATE ROUTE -> PARAM [ID]
export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("Invalid ID", {status: 400});
        const body: TransporteAereoRequest = await req.json();
        const anio = await prisma.anio.findFirst({where: {id: body.anio_id},});
        if (!anio) return new NextResponse("Año no encontrado", {status: 404});

        const transporteAereo = await prisma.transporteAereo.update({
            where: {
                id: id,
            },
            data: {
                numeroPasajeros: body.numeroPasajeros,
                origen: body.origen,
                destino: body.destino,
                isIdaVuelta: body.isIdaVuelta,
                fechaSalida: body.fechaSalida ? new Date(body.fechaSalida) : null,
                fechaRegreso: body.fechaRegreso ? new Date(body.fechaRegreso) : null,
                distanciaTramo: body.distanciaTramo,
                kmRecorrido: body.kmRecorrido,
                mes_id: body.mes_id,
                anio_id: body.anio_id,
                sede_id: body.sede_id,
                anio_mes: Number(anio.nombre) * 100 + Number(body.mes_id),
                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                anio: true,
                sede: true,
                mes: true,
                File: true,
            },
        });

        return NextResponse.json({
            message: "Registro de Transporte Aereo actualizado",
            transporteAereo: formatTransporteAereo(transporteAereo),
        });
    } catch (error) {
        console.error("Error updating Transporte Aereo", error);
        return new NextResponse("Error updating Transporte Aereo", {status: 500});
    }
}

// DELETE ROUTE -> PARAM [ID]
export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", {status: 400});
        }

        const transporteAereo = await prisma.transporteAereo.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({
            message: "Registro de Transporte Aereo eliminado",
        });
    } catch (error) {
        console.error("Error deleting Transporte Aereo", error);
        return new NextResponse("Error deleting Transporte Aereo", {status: 500});
    }
}
