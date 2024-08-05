import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {Fertilizante} from "@prisma/client";
import {formatArea} from "@/lib/resources/areaResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const areas = await prisma.area.findMany();

        const formattedAreas: Fertilizante[] = areas.map(
            (area) => formatArea(area)
        );

        return NextResponse.json(formattedAreas);
    } catch (error) {
        console.error("Error finding areas", error);
        return new NextResponse("Error finding areas", {status: 500});
    }
}
