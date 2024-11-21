import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTipoVehiculoFactor} from "@/lib/resources/tipoVehiculoFactor";
import {VehiculoFactorRequest} from "@/components/tipoVehiculo/services/tipoVehiculoFactor.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const factorTransporteCasaTrabajo = await prisma.factorTransporteCasaTrabajo.findUnique({
            where: {
                id: id,
            },
            include: {
                anio: true,
                tipoVehiculo: true,
            },
        });

        if (!factorTransporteCasaTrabajo) {
            return NextResponse.json(
                {message: "Tipo Vehiculo Factor no encontrado"},
                {status: 404}
            );
        }

        return NextResponse.json(formatTipoVehiculoFactor(factorTransporteCasaTrabajo));
    } catch (error) {
        console.error("Error finding tipo combustible factor", error);
        return NextResponse.json(
            {message: "Error finding tipo combustible factor"},
            {status: 500}
        );
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({message: "Invalid ID"}, {status: 400});
        }
        const factor = await prisma.factorTransporteCasaTrabajo.findUnique({where: {id}});
        if (!factor)
            return NextResponse.json(
                {message: "Factor Tipo de Vehiculo no encontrado"},
                {status: 404}
            );
        const body: VehiculoFactorRequest = await req.json();
        const factorTransporteCasaTrabajo = await prisma.factorTransporteCasaTrabajo.update({
            where: {
                id: id,
            },
            include: {
                anio: true,
                tipoVehiculo: true,
            },
            data: {
                factorCO2: body.factorCO2,
                factorCH4: body.factorCH4,
                factorN2O: body.factorN2O,
                factor: body.factor,
                tipoVehiculoId: body.tipoVehiculoId,
                anioId: body.anioId,
                fuente: body.fuente,
                link: body.link,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Factor Tipo de Vehiculo actualizado",
            factorTransporteCasaTrabajo: formatTipoVehiculoFactor(factorTransporteCasaTrabajo),
        });
    } catch (error) {
        console.error("Error actualizando Factor de Tipo de Vehiculo", error);
        return NextResponse.json(
            {message: "Error actualizando Factor de Tipo de Vehiculo"},
            {status: 500}
        );
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({message: "ID inválido"}, {status: 400});
        }

        await prisma.factorTransporteCasaTrabajo.delete({
            where: {id},
        });

        return NextResponse.json({message: "Factor de Tipo de Vehiculo eliminado"});
    } catch (error: any) {
        console.error("Error eliminando Factor de Tipo de Vehiculo", error);
        return NextResponse.json(
            {message: "Error eliminando Factor de Tipo de Vehiculo"},
            {status: 500}
        );
    }
}
