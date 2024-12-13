import { NextRequest, NextResponse } from "next/server";
import {
  ResponseUploadFile,
  uploadFileToDrive,
} from "@/lib/googledrive/drive.actions";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    await checkTypeSource(body);
    const files = formData.getAll("files[]") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No se ha proporcionado un archivo" },
        { status: 400 }
      );
    } else {
      for (const file of files) {
        const responseLinks: ResponseUploadFile = await uploadFileToDrive(file);
        await prisma.file.create({
          data: {
            fileId: responseLinks.fileId,
            name: file.name,
            downloadLink: responseLinks.webContentLink,
            streamLink: responseLinks.webViewLink,
            combustibleId:
              body.type === "combustibleMovil" ||
              body.type === "combustibleEstacionaria"
                ? parseInt(body.id.toString())
                : null,
            extintorId:
              body.type === "extintor" ? parseInt(body.id.toString()) : null,
            fertilizanteId:
              body.type === "fertilizante"
                ? parseInt(body.id.toString())
                : null,
            consumoEnergiaId:
              body.type === "consumoEnergia"
                ? parseInt(body.id.toString())
                : null,
            transporteAereoId:
              body.type === "transporteAereo"
                ? parseInt(body.id.toString())
                : null,
            transporteTerrestreId:
              body.type === "transporteTerrestre"
                ? parseInt(body.id.toString())
                : null,
            taxiId: body.type === "taxi" ? parseInt(body.id.toString()) : null,
            transporteCasaTrabajoId:
              body.type === "transporteCasaTrabajo"
                ? parseInt(body.id.toString())
                : null,
            consumoPapelId:
              body.type === "consumoPapel"
                ? parseInt(body.id.toString())
                : null,
            consumoAguaId:
              body.type === "consumoAgua" ? parseInt(body.id.toString()) : null,
            activoId:
              body.type === "activo" ? parseInt(body.id.toString()) : null,
            consumibleId:
              body.type === "consumible" ? parseInt(body.id.toString()) : null,
          },
        });
      }
    }
    return new NextResponse("Archivo procesado correctamente", { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al procesar el archivo";
    console.error(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}

const checkTypeSource = async (body: any) => {
  const id = parseInt(body.id);
  switch (body.type) {
    case "combustibleMovil":
      await prisma.combustible
        .findUniqueOrThrow({ where: { id, tipo: "movil" } })
        .catch(() => {
          throw new Error("No se ha encontrado el registro de combustible");
        });
      break;
    case "combustibleEstacionaria":
      await prisma.combustible
        .findUniqueOrThrow({ where: { id, tipo: "estacionaria" } })
        .catch(() => {
          throw new Error("No se ha encontrado el registro de combustible");
        });
      break;
    case "extintor":
      await prisma.extintor.findUniqueOrThrow({ where: { id } }).catch(() => {
        throw new Error("No se ha encontrado el registro de extintor");
      });
      break;
    case "fertilizante":
      await prisma.fertilizante
        .findUniqueOrThrow({ where: { id } })
        .catch(() => {
          throw new Error("No se ha encontrado el registro de fertilizante");
        });
      break;
    case "consumoEnergia":
      await prisma.consumoEnergia
        .findUniqueOrThrow({ where: { id } })
        .catch(() => {
          throw new Error(
            "No se ha encontrado el registro de consumo de energía"
          );
        });
      break;
    case "transporteAereo":
      await prisma.transporteAereo
        .findUniqueOrThrow({ where: { id } })
        .catch(() => {
          throw new Error(
            "No se ha encontrado el registro de transporte aéreo"
          );
        });
      break;
    case "transporteTerrestre":
      await prisma.transporteTerrestre
        .findUniqueOrThrow({ where: { id } })
        .catch(() => {
          throw new Error(
            "No se ha encontrado el registro de transporte terrestre"
          );
        });
      break;
    case "taxi":
      await prisma.taxi.findUniqueOrThrow({ where: { id } }).catch(() => {
        throw new Error("No se ha encontrado el registro de taxi");
      });
      break;
    case "transporteCasaTrabajo":
      await prisma.casaTrabajo
        .findUniqueOrThrow({ where: { id } })
        .catch(() => {
          throw new Error(
            "No se ha encontrado el registro de transporte casa trabajo"
          );
        });
      break;
    case "consumoPapel":
      await prisma.consumoPapel
        .findUniqueOrThrow({ where: { id } })
        .catch(() => {
          throw new Error(
            "No se ha encontrado el registro de consumo de papel"
          );
        });
      break;
    case "consumoAgua":
      await prisma.consumoAgua
        .findUniqueOrThrow({ where: { id } })
        .catch(() => {
          throw new Error("No se ha encontrado el registro de consumo de agua");
        });
      break;
    case "activo":
      await prisma.activo.findUniqueOrThrow({ where: { id } }).catch(() => {
        throw new Error("No se ha encontrado el registro de activo");
      });
      break;
    case "consumible":
      await prisma.consumible.findUniqueOrThrow({ where: { id } }).catch(() => {
        throw new Error("No se ha encontrado el registro de consumible");
      });
      break;
    default:
      throw new Error("Tipo de archivo no válido");
  }
};
