import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {TipoExtintorRequest} from "@/components/tipoExtintor/services/tipoExtintor.interface";
import {formatTipoExtintor} from "@/lib/resources/tipoExtintorResource";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id))
            return NextResponse.json({message: "Invalid ID"}, {status: 404});
        const tipoExtintor = await prisma.tipoExtintor.findUnique({
            where: {
                id: id,
            },
        });

        if (!tipoExtintor)
            return NextResponse.json(
                {message: "Tipo Extintor no encontrada"},
                {status: 404}
            );
        return NextResponse.json(formatTipoExtintor(tipoExtintor));
    } catch (error) {
        console.error("Error buscando Tipo Extintor", error);
        return NextResponse.json(
            {message: "Error buscando Tipo Extintor"},
            {status: 500}
        );
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id))
            return NextResponse.json({message: "Invalid ID"}, {status: 400});
        const body: TipoExtintorRequest = await req.json();

        const tipoExtintor = await prisma.tipoExtintor.update({
            where: {
                id: id,
            },
            data: {
                nombre: body.nombre,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Tipo Extintor actualizado correctamente",
            tipoExtintor: formatTipoExtintor(tipoExtintor),
        });
    } catch (error) {
        console.error("Error actualizando Tipo Extintor", error);
        return NextResponse.json(
            {message: "Error actualizando Tipo Extintor"},
            {status: 500}
        );
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id))
            return NextResponse.json({message: "ID inválido"}, {status: 400});

        await prisma.tipoExtintor.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Tipo Extintor eliminado correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando Tipo Extintor", error);
        return NextResponse.json(
            {message: "Error eliminando Tipo Extintor"},
            {status: 500}
        );
    }
}
