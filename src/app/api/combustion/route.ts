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
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const sort = searchParams.get("sort") ?? undefined;
        const direction = searchParams.get("direction") ?? undefined;
        const anio = searchParams.get("anioId") ?? undefined;
        const tipoCombustibleId = searchParams.get("tipoCombustibleId") ?? undefined


        let anioId;
        if (anio) {
            const anioRecord = await prisma.anio.findFirst({
                where: {
                    nombre: anio,
                },
            });
            anioId = anioRecord ? anioRecord.id : undefined;
        }

        const combustibles = await prisma.combustible.findMany({
            where: {
                tipo: tipo ? tipo : undefined,
                sede_id: sedeId ? parseInt(sedeId) : undefined,
                anio_id: anioId,
                tipoCombustible_id: tipoCombustibleId ? parseInt(tipoCombustibleId) : undefined,
            },
            include: {
                tipoCombustible: true,
                mes: true,
                anio: true,
                sede: true,
            },
            orderBy: {
                [sort ?? "id"]: direction ?? "desc",
            },
        });

        const formattedCombustibles: Combustible[] = combustibles.map(
            (combustible) => formatCombustible(combustible)
        );

        return NextResponse.json(formattedCombustibles);
    } catch (error) {
        console.error("Error finding combustibles", error);
        return new NextResponse("Error finding combustibles", {status: 500});
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

        const formattedCombustible = formatCombustible(combustible);

        return NextResponse.json(formattedCombustible);
    } catch (error) {
        console.error("Error creating combustible", error);
        return new NextResponse("Error creating combustible", {status: 500});
    }
}
