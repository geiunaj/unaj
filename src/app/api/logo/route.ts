import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const file = await prisma.file.findFirstOrThrow({
      where: {
        type: {
          equals: type,
        },
      },
    });
    return NextResponse.json({ file }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener los archivos";
    console.error(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}

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

    if (logo) {
      // Buscar si ya existe un archivo con el mismo nombre
      const file = await prisma.file.findFirst({
        where: {
          type: "logo",
        },
      });

      if (file) {
        const url = decodeURIComponent(file.streamLink);
        await del(url);
        // Eliminar el archivo existente
        await prisma.file.delete({
          where: {
            id: file.id,
          },
        });
      }

      // Guardar el archivo 'logo'
      const logoUpload = await put(logo.name, logo, {
        access: "public",
      });
      await prisma.file.create({
        data: {
          name: logo.name,
          downloadLink: logoUpload.downloadUrl,
          streamLink: logoUpload.url,
          fileId: logoUpload.url,
          type: "logo",
        },
      });
    }

    if (fondo) {
      const file = await prisma.file.findFirst({
        where: {
          type: "fondo",
        },
      });

      if (file) {
        const url = decodeURIComponent(file.streamLink);
        await del(url);
        // Eliminar el archivo existente
        await prisma.file.delete({
          where: {
            id: file.id,
          },
        });
      }

      // Guardar el archivo 'fondo'
      const fondoUpload = await put(fondo.name, fondo, {
        access: "public",
      });

      await prisma.file.create({
        data: {
          name: fondo.name,
          downloadLink: fondoUpload.downloadUrl,
          streamLink: fondoUpload.url,
          fileId: fondoUpload.url,
          type: "fondo",
        },
      });
    }

    if (logoDark) {
      const file = await prisma.file.findFirst({
        where: {
          type: "logoDark",
        },
      });

      if (file) {
        const url = decodeURIComponent(file.streamLink);
        await del(url);
        // Eliminar el archivo existente
        await prisma.file.delete({
          where: {
            id: file.id,
          },
        });
      }
      // Guardar el archivo 'logoDark'
      const logoDarkUpload = await put(logoDark.name, logoDark, {
        access: "public",
      });

      await prisma.file.create({
        data: {
          name: logoDark.name,
          downloadLink: logoDarkUpload.downloadUrl,
          streamLink: logoDarkUpload.url,
          fileId: logoDarkUpload.url,
          type: "logoDark",
        },
      });
    }

    if (fondoDark) {
      const file = await prisma.file.findFirst({
        where: {
          type: "fondoDark",
        },
      });

      if (file) {
        const url = decodeURIComponent(file.streamLink);
        await del(url);
        // Eliminar el archivo existente
        await prisma.file.delete({
          where: {
            id: file.id,
          },
        });
      }
      // Guardar el archivo 'fondoDark'
      const fondoDarkUpload = await put(fondoDark.name, fondoDark, {
        access: "public",
      });

      await prisma.file.create({
        data: {
          name: fondoDark.name,
          downloadLink: fondoDarkUpload.downloadUrl,
          streamLink: fondoDarkUpload.url,
          fileId: fondoDarkUpload.url,
          type: "fondoDark",
        },
      });
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
