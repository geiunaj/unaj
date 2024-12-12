import {NextRequest, NextResponse} from "next/server";
import {uploadFileToDrive} from "@/lib/googledrive/drive.actions";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData.entries());
        const files = formData.getAll("files[]") as File[];
        console.log("Files:", files);
        if (!files || files.length === 0) {
            return NextResponse.json({message: "No se ha proporcionado un archivo"}, {status: 400});
        } else {
            for (const file of files) {
                await uploadFileToDrive(file);
            }
        }
        return new NextResponse("Archivo procesado correctamente", {status: 200});
    } catch (error) {
        console.error("Error procesando la solicitud de archivo:", error);
        return new NextResponse("Error al procesar el archivo", {status: 500});
    }
}
