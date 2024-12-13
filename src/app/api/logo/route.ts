import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const logo = formData.get("logo") as File;
    const logoDark = formData.get("logoDark") as File;
    const fondo = formData.get("fondo") as File;
    const fondoDark = formData.get("fondoDark") as File;

    if (!logo && !fondo && !logoDark && !fondoDark) {
      return NextResponse.json(
        { message: "No se ha proporcionado un archivo" },
        { status: 400 }
      );
    }

    // Crear la ruta donde se guardarán los archivos
    const uploadDir = path.join(process.cwd(), "public", "img");
    await mkdir(uploadDir, { recursive: true });

    if (logo) {
      // Guardar el archivo 'logo'
      const logoPath = path.join(uploadDir, "logo.png");
      const logoBuffer = new Uint8Array(await logo.arrayBuffer());
      await writeFile(logoPath, logoBuffer);
    }

    if (fondo) {
      // Guardar el archivo 'fondo'
      const fondoPath = path.join(uploadDir, "fondo.png");
      const fondoBuffer = new Uint8Array(await fondo.arrayBuffer());
      await writeFile(fondoPath, fondoBuffer);
    }

    if (logoDark) {
      // Guardar el archivo 'logoDark'
      const logoDarkPath = path.join(uploadDir, "logoDark.png");
      const logoDarkBuffer = new Uint8Array(await logoDark.arrayBuffer());
      await writeFile(logoDarkPath, logoDarkBuffer);
    }

    if (fondoDark) {
      // Guardar el archivo 'fondoDark'
      const fondoDarkPath = path.join(uploadDir, "fondoDark.png");
      const fondoDarkBuffer = new Uint8Array(await fondoDark.arrayBuffer());
      await writeFile(fondoDarkPath, fondoDarkBuffer);
    }

    return NextResponse.json(
      {
        message: "Archivos procesados correctamente",
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al procesar el archivo";
    console.error(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
