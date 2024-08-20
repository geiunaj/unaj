import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {Fertilizante} from "@prisma/client";
import {formatArea} from "@/lib/resources/areaResource";
import {AreaRequest} from "@/components/area/services/area.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const areas = await prisma.area.findMany(
            {
                include: {
                    sede: true,
                }
            }
        );

        const formattedAreas: Fertilizante[] = areas.map(formatArea);

        return NextResponse.json(formattedAreas);
    } catch (error) {
        console.error("Error buscando areas", error);
        return new NextResponse("Error buscando areas", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: AreaRequest = await req.json();

        const newArea = await prisma.area.create({
            data: {
                nombre: body.nombre,

                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Area creada correctamente",
            area: formatArea(newArea),
        });
    } catch (error) {
        console.error("Error creando area", error);
        return new NextResponse("Error creando area", {status: 500});
    }
}
