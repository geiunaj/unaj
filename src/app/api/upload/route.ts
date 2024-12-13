import {NextRequest, NextResponse} from "next/server";
import {ResponseUploadFile, uploadFileToDrive} from "@/lib/googledrive/drive.actions";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());
        await checkTypeSource(body);
        const files = formData.getAll("files[]") as File[];
        if (!files || files.length === 0) {
            return NextResponse.json({message: "No se ha proporcionado un archivo"}, {status: 400});
        } else {
            for (const file of files) {
                const responseLinks: ResponseUploadFile = await uploadFileToDrive(file);
                await prisma.file.create({
                    data: {
                        fileId: responseLinks.fileId,
                        name: file.name,
                        downloadLink: responseLinks.webContentLink,
                        streamLink: responseLinks.webViewLink,
                        combustibleId: body.type === "combustibleMovil" || body.type === "combustibleEstacionaria" ? parseInt(body.id.toString()) : null,
                    }
                });
            }
        }
        return new NextResponse("Archivo procesado correctamente", {status: 200});
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error al procesar el archivo";
        console.error(error);
        return NextResponse.json({message}, {status: 500});
    }
}


const checkTypeSource = async (body: any) => {
    const id = parseInt(body.id);
    switch (body.type) {
        case "combustibleMovil":
            await prisma.combustible.findUniqueOrThrow({where: {id, tipo: "movil"}}).catch(() => {
                throw new Error("No se ha encontrado el registro de combustible");
            });
            break;
        case "combustibleEstacionaria":
            await prisma.combustible.findUniqueOrThrow({where: {id, tipo: "estacionaria"}}).catch(() => {
                throw new Error("No se ha encontrado el registro de combustible");
            });
            break;
        default:
            throw new Error("Tipo de archivo no válido");
    }
}