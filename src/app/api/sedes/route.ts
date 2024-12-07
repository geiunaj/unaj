import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {SedeRequest} from "@/components/sede/services/sede.interface";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const sedes = await prisma.sede.findMany();
        return NextResponse.json(sedes);
    } catch (error) {
        console.error("Error buscando sedes", error);
        return NextResponse.json({message: "Error buscando sedes"}, {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: SedeRequest = await req.json();

        const newSede = await prisma.sede.create({
            data: {
                name: body.name,
            },
        });

        return NextResponse.json({
            message: "Sede creada correctamente",
            sede: newSede,
        });
    } catch (error) {
        console.error("Error creando sede", error);
        return NextResponse.json({message: "Error creando sede"}, {status: 500});
    }
}
