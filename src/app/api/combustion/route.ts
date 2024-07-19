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
        const anioId = searchParams.get("anioId") ?? undefined;

        const combustibles = await prisma.combustible.findMany({
            where: {
                tipo: tipo ? tipo : undefined,
                sede_id: sedeId ? parseInt(sedeId) : undefined,
                anio_id: anioId ? parseInt(anioId) : undefined,
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

        const formattedCombustibles: Combustible[] = [];

        for (const combustible of combustibles) {
            formattedCombustibles.push(formatCombustible(combustible));
        }

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
