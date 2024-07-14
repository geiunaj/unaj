import { NextRequest, NextResponse } from "next/server";
import XLSX from "xlsx";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Obtener todos los datos de combustibles de la base de datos
    const combustion = await prisma.combustible.findMany();

    // Preparar los datos para añadir
    const headers = ["id", "tipo", "tipoEquipo", "consumo", "mes_id"];
    const combustiblesData = combustion.map((combustible) => [
      combustible.id,
      combustible.tipo,
      combustible.tipoEquipo,
      combustible.consumo,
      combustible.mes_id,
    ]);

    // Crear un nuevo libro de trabajo y una nueva hoja
    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.aoa_to_sheet([[]]);

    // Unir la celda del título A1 a lo largo del ancho de los encabezados
    newSheet["!merges"] = [
      { s: { c: 0, r: 0 }, e: { c: headers.length - 1, r: 0 } },
    ];

    // Insertar título en A1
    newSheet["A1"] = {
      t: "s",
      v: "Combustibles",
      s: {
        font: {
          bold: true,
          sz: 24,
        },
      },
    };

    // Aplicar alineación centrada a la celda combinada
    for (let col = 0; col < headers.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!newSheet[cellAddress]) newSheet[cellAddress] = {};
      newSheet[cellAddress].s = {
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }

    // Combinar encabezados y datos, insertando encabezados a partir de la segunda fila
    const data = [headers, ...combustiblesData];

    // Añadir datos a la hoja comenzando desde A2
    XLSX.utils.sheet_add_aoa(newSheet, data, { origin: "A2" });

    // Añadir la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Combustibles");

    // Convertir el nuevo libro a un buffer
    const buffer = XLSX.write(newWorkbook, { type: "buffer" });

    // Devolver el buffer como respuesta
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=output.xlsx",
      },
    });
  } catch (error) {
    console.error("Error al encontrar combustibles", error);
    return new NextResponse("Error al encontrar combustibles", { status: 500 });
  }
}
