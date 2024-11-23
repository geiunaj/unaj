import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {VehiculoFactorRequest} from "@/components/tipoVehiculo/services/tipoVehiculoFactor.interface";
import {formatTipoVehiculoFactor} from "@/lib/resources/tipoVehiculoFactor";
import {getAnioId} from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const tipoVehiculoId = searchParams.get("tipoVehiculoId");
        const anio = searchParams.get("anioId");
        let anioId;
        if (anio) anioId = await getAnioId(anio);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const whereOptions = {
            tipoVehiculoId: tipoVehiculoId ? parseInt(tipoVehiculoId) : undefined,
            anioId: anioId,
        };

        const tiposVehiculoFactor = await prisma.factorTransporteCasaTrabajo.findMany({
            where: whereOptions,
            include: {anio: true, tipoVehiculo: true},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
            orderBy: {tipoVehiculo: {nombre: "asc"}},
        });

        if (perPage > 0) {
            const totalRecords = await prisma.factorTransporteCasaTrabajo.count({
                where: whereOptions,
            });
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: tiposVehiculoFactor.map(formatTipoVehiculoFactor),
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(tiposVehiculoFactor.map(formatTipoVehiculoFactor));
    } catch (error) {
        console.error("Error buscando Factores Tipos Vehiculo", error);
        return NextResponse.json(
            {message: "Error buscando Factores Tipos Vehiculo"},
            {status: 500}
        );
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: VehiculoFactorRequest = await req.json();
        const factorTipoVehiculo = await prisma.factorTransporteCasaTrabajo.create({
            data: {
                factorCO2: body.factorCO2,
                factorCH4: body.factorCH4,
                factorN2O: body.factorN2O,
                factor: body.factor,
                tipoVehiculoId: body.tipoVehiculoId,
                anioId: body.anioId,
                fuente: body.fuente,
                link: body.link,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        return NextResponse.json({
            message: "Factor Tipo de Vehiculo creado",
            factorVehiculo: factorTipoVehiculo,
        });
    } catch (error) {
        console.error("Error creando el Factor Tipo de Vehiculo", error);
        return NextResponse.json(
            {message: "Error creando el Factor Tipo de Vehiculo"},
            {status: 500}
        );
    }
}
