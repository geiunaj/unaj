import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de que la ruta sea correcta
import {formaFertilizante} from "@/lib/resources/fertilizanteResource";
import {Fertilizante} from "@prisma/client";
import {FertilizanteRequest} from "@/components/fertilizantes/services/fertilizante.interface";

// GET ROUTE -> SIN PARAMETROS
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);

        const tipoFertilizanteId = searchParams.get("tipoFertilizanteId") ?? undefined;
        const claseFertilizante = searchParams.get("claseFertilizante") ?? undefined;
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const anio = searchParams.get("anio") ?? undefined;
        const sort = searchParams.get("sort") ?? "id";
        const direction = searchParams.get("direction") ?? "desc";

        const page = parseInt(searchParams.get("page") ?? "1");
        const perPage = parseInt(searchParams.get("perPage") ?? "10");

        let anioId: number | undefined;
        if (anio) {
            const anioRecord = await prisma.anio.findFirst({
                where: {nombre: anio},
            });
            anioId = anioRecord ? anioRecord.id : undefined;
        }

        const whereOptions = {
            sede_id: sedeId ? parseInt(sedeId) : undefined,
            anio_id: anioId,
            tipoFertilizante_id: tipoFertilizanteId
                ? parseInt(tipoFertilizanteId)
                : undefined,
            tipoFertilizante: {
                clase: claseFertilizante ? claseFertilizante : undefined,
            },
        };

        const totalRecords = await prisma.fertilizante.count({where: whereOptions});
        const totalPages = Math.ceil(totalRecords / perPage);

        const fertilizantes = await prisma.fertilizante.findMany({
            where: whereOptions,
            include: {
                anio: true,
                sede: true,
                tipoFertilizante: true,
            },
            orderBy: sort
                ? [{[sort]: direction || 'desc'}]
                : [
                    {anio_id: 'desc'},
                ],
            skip: (page - 1) * perPage,
            take: perPage,
        });

        const formattedFertilizantes: Fertilizante[] = fertilizantes.map(
            (fertilizante) => formaFertilizante(fertilizante)
        );

        return NextResponse.json({
            data: formattedFertilizantes,
            meta: {
                page,
                perPage,
                totalPages,
                totalRecords,
            },
        });
    } catch (error) {
        console.error("Error al buscar los fertilizantes", error);
        return new NextResponse("Error al buscar los fertilizantes", {
            status: 500,
        });
    }
}


// POST ROUTE -> SIN PARAMETROS
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: FertilizanteRequest = await req.json();

        // Validar campos requeridos
        if (
            typeof body.tipoFertilizante_id !== "number" ||
            typeof body.cantidad !== "number" ||
            typeof body.sede_id !== "number" ||
            typeof body.anio_id !== "number"
        ) {
            return new NextResponse("Campos requeridos faltantes o inválidos", {
                status: 400,
            });
        }

        const fertilizante = await prisma.fertilizante.create({
            data: {
                tipoFertilizante_id: body.tipoFertilizante_id,
                cantidad: body.cantidad,
                sede_id: body.sede_id,
                anio_id: body.anio_id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                anio: true,
                sede: true,
                tipoFertilizante: true,
            },
        });

        const formattedFertilizantes = formaFertilizante(fertilizante);

        return NextResponse.json(formattedFertilizantes);
    } catch (error) {
        console.error("Error al crear el fertilizante", error);
        return new NextResponse("Error al crear el fertilizante", {status: 500});
    }
}
