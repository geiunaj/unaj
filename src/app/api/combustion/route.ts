import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta sea correcta
import {formatCombustible} from "@/lib/resources/combustionResource";
import {Combustible} from "@prisma/client";
import {CombustionRequest} from "@/components/combustion/services/combustion.interface";

// INDEX
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const tipo = searchParams.get("tipo") ?? undefined;
        const tipoCombustibleId = searchParams.get("tipoCombustibleId") ?? undefined
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const anio = searchParams.get("anio") ?? undefined;
        const mesId = searchParams.get("mesId") ?? undefined;
        const sort = searchParams.get("sort") ?? undefined;
        const direction = searchParams.get("direction") ?? undefined;

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        let anioId;
        if (anio) {
            const anioRecord = await prisma.anio.findFirst({
                where: {
                    nombre: anio,
                },
            });
            anioId = anioRecord ? anioRecord.id : undefined;
        }

        const whereOptions = {
            tipo: tipo ? tipo : undefined,
            tipoCombustible_id: tipoCombustibleId ? parseInt(tipoCombustibleId) : undefined,
            sede_id: sedeId ? parseInt(sedeId) : undefined,
            anio_id: anioId,
            mes_id: mesId ? parseInt(mesId) : undefined,
        };

        const totalRecords = await prisma.combustible.count({where: whereOptions});
        const totalPages = Math.ceil(totalRecords / perPage);

        const combustibles = await prisma.combustible.findMany({
            where: whereOptions,
            include: {
                tipoCombustible: true,
                mes: true,
                anio: true,
                sede: true,
            },
            orderBy: sort
                ? [{[sort]: direction || 'desc'}]
                : [
                    {anio_id: 'desc'},
                    {mes_id: 'desc'}
                ],
            skip: (page - 1) * perPage,
            take: perPage,
        });

        const formattedCombustibles: Combustible[] = combustibles.map(
            (combustible) => formatCombustible(combustible)
        );

        return NextResponse.json({
            data: formattedCombustibles,
            meta: {
                page,
                perPage,
                totalRecords,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Error buscando consumos", error);
        return new NextResponse("Error buscando consumos", {status: 500});
    }
}

// CREATE
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: CombustionRequest = await req.json();
        const combustible = await prisma.combustible.create({
            data: {
                tipo: body.tipo,
                tipoEquipo: body.tipoEquipo,
                consumo: body.consumo,

                sede_id: body.sede_id,
                tipoCombustible_id: body.tipoCombustible_id,
                anio_id: body.anio_id,
                mes_id: body.mes_id,

                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                tipoCombustible: true,
                mes: true,
                anio: true,
                sede: true,
            },
        });

        return NextResponse.json({
            message: "Combustible regsistrado",
            combustible: formatCombustible(combustible),
        });
    } catch (error) {
        console.error("Error registrando consumo", error);
        return new NextResponse("Error registrando consumo", {status: 500});
    }
}
