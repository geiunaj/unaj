import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {TipoVehiculoRequest} from "@/components/tipoVehiculo/services/tipoVehiculo.interface";
import {formatTipoVehiculo} from "@/lib/resources/tipoVehiculoResource";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id))
            return NextResponse.json({message: "Invalid ID"}, {status: 404});
        const tipoVehiculo = await prisma.tipoVehiculo.findUnique({
            where: {
                id: id,
            },
        });

        if (!tipoVehiculo)
            return NextResponse.json(
                {message: "Tipo Vehiculo no encontrada"},
                {status: 404}
            );
        return NextResponse.json(formatTipoVehiculo(tipoVehiculo));
    } catch (error) {
        console.error("Error buscando Tipo Vehiculo", error);
        return NextResponse.json(
            {message: "Error buscando Tipo Vehiculo"},
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
        if (isNaN(id))
            return NextResponse.json({message: "Invalid ID"}, {status: 400});
        const body: TipoVehiculoRequest = await req.json();

        const tipoVehiculo = await prisma.tipoVehiculo.update({
            where: {
                id: id,
            },
            data: {
                nombre: body.nombre,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Tipo Vehiculo actualizado correctamente",
            tipoVehiculo: formatTipoVehiculo(tipoVehiculo),
        });
    } catch (error) {
        console.error("Error actualizando Tipo Vehiculo", error);
        return NextResponse.json(
            {message: "Error actualizando Tipo Vehiculo"},
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
        if (isNaN(id))
            return NextResponse.json({message: "ID inválido"}, {status: 400});

        await prisma.tipoVehiculo.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Tipo Vehiculo eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Tipo Vehiculo", error);
        return NextResponse.json(
            {message: "Error eliminando Tipo Vehiculo"},
            {status: 500}
        );
    }
}
