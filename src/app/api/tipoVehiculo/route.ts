import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    TipoVehiculo,
    TipoVehiculoRequest,
} from "@/components/tipoVehiculo/services/tipoVehiculo.interface";
import {formatTipoVehiculo} from "@/lib/resources/tipoVehiculoResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");
        const nombre = searchParams.get("nombre") ?? "";
        const tiposVehiculo = await prisma.tipoVehiculo.findMany({
            where: {
                nombre: {
                    contains: nombre,
                },
            },
            orderBy: {nombre: "asc"},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });
        if (perPage > 0) {
            const totalRecords = await prisma.tipoVehiculo.count({
                where: {
                    nombre: {
                        contains: nombre,
                    },
                },
            });
            const totalPages = Math.ceil(totalRecords / perPage);
            const tiposVehiculoFormatted: any[] = tiposVehiculo.map((vehiculo, index) => {
                const newVehiculo = formatTipoVehiculo(vehiculo);
                newVehiculo.rn = (page - 1) * perPage + index + 1;
                return newVehiculo;
            });
            return NextResponse.json({
                data: tiposVehiculoFormatted,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }
        const formattedTipoVehiculos: TipoVehiculo[] =
            tiposVehiculo.map(formatTipoVehiculo);
        return NextResponse.json(formattedTipoVehiculos);
    } catch (error) {
        console.error("Error buscando tipos de vehiculo", error);
        return NextResponse.json(
            {message: "Error buscando tipos de vehiculo"},
            {status: 500}
        );
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TipoVehiculoRequest = await req.json();
        const tipoVehiculo = await prisma.tipoVehiculo.create({
            data: {
                nombre: body.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Tipo de Vehiculo Creado",
            tipoVehiculo: tipoVehiculo,
        });
    } catch (error) {
        console.error("Error creando Tipo de Vehiculo", error);
        return NextResponse.json(
            {message: "Error creando Tipo de Vehiculo"},
            {status: 500}
        );
    }
}
