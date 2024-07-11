import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta sea correcta
import { formatCombustible } from "@/lib/resources/combustionResource";
import { Combustible } from "@prisma/client";
import { CombustionRequest } from "@/components/combustion/services/combustion.interface";
import {formaFertilizante} from "@/lib/resources/fertilizanteResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        // const { searchParams } = new URL(req.url);
        // const tipo = searchParams.get("tipo") ?? undefined;
        // const sedeId = searchParams.get("sedeId") ?? undefined;
        // const sort = searchParams.get("sort") ?? undefined;
        // const direction = searchParams.get("direction") ?? undefined;

        const fertilizantes = await prisma.fertilizante.findMany({
            // where: {
            //     tipo: tipo ? tipo : undefined,
            //     sede_id: sedeId ? parseInt(sedeId) : undefined,
            // },
            include: {
                // ficha: true,
                anio: true,
                sede: true,
                tipoFertilizante: true,
            },
            // orderBy: {
            //     [sort ?? "id"]: direction ?? "desc",
            // },
        });

        const formattedFertilizantes: Combustible[] = [];

        for (const fertilizante of fertilizantes) {
            formattedFertilizantes.push(formaFertilizante(fertilizante));
        }

        return NextResponse.json(formattedFertilizantes);
    } catch (error) {
        console.error("Error finding fertilizantes", error);
        return new NextResponse("Error finding fertilizantes", { status: 500 });
    }
}
//
// export async function POST(req: NextRequest): Promise<NextResponse> {
//     try {
//         const body: CombustionRequest = await req.json();
//         const combustible = await prisma.combustible.create({
//             data: {
//                 tipo: body.tipo,
//                 tipoEquipo: body.tipoEquipo,
//                 consumo: body.consumo,
//
//                 sede_id: body.sede_id,
//                 tipoCombustible_id: body.tipoCombustible_id,
//                 anio_id: body.anio_id,
//                 mes_id: body.mes_id,
//
//                 created_at: new Date(),
//                 updated_at: new Date(),
//             },
//         });
//
//         return NextResponse.json(combustible);
//     } catch (error) {
//         console.error("Error creating combustible", error);
//         return new NextResponse("Error creating combustible", { status: 500 });
//     }
// }
