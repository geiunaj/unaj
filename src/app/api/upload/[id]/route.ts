import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {deleteFileFromDrive} from "@/lib/googledrive/drive.actions";

export async function DELETE(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id);
        const file = await prisma.file.findUnique({where: {id}});
        if (!file) return NextResponse.json({message: "No se ha encontrado el archivo"}, {status: 404});
        await deleteFileFromDrive(file.fileId).then(async () => {
            await prisma.file.delete({where: {id}});
        });
        return NextResponse.json({message: "Archivo eliminado correctamente"}, {status: 200});
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al eliminar el archivo";
        console.error(error);
        return NextResponse.json({message}, {status: 500});
    }
}