import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {SedeRequest} from "@/components/sede/services/sede.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({messsage: "Invalid ID"}, {status: 404});
        const sede = await prisma.sede.findUnique({
            where: {
                id: id,
            },
        });
        if (!sede) return NextResponse.json({messsage: "Sede no encontrada"}, {status: 404});
        return NextResponse.json(sede);
    } catch (error) {
        console.error("Error buscando sede", error);
        return NextResponse.json({messsage: "Error buscando sede"}, {status: 500});
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Invalid ID"}, {status: 400});

        const sedeData: SedeRequest = await req.json();

        const sede = await prisma.sede.update({
            where: {
                id: id,
            },
            data: {
                name: sedeData.name,
            },
        });

        return NextResponse.json({
            message: "Sede actualizada correctamente",
            sede: sede,
        });
    } catch (error) {
        console.error("Error actualizando sede", error);
        return NextResponse.json({messsage: "Error actualizando sede"}, {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Invalid ID"}, {status: 400});

        await prisma.sede.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Sede eliminada correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando sede", error);
        return NextResponse.json({messsage: "Error eliminando sede"}, {status: 500});
    }
}
