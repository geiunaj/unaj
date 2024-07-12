import { formattedConsumoPapel } from "@/lib/resources/papelResource";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    // const tipo = searchParams.get("tipo") ?? undefined;
    const sedeId = searchParams.get("sedeId") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;
    const direction = searchParams.get("direction") ?? undefined;

    const consumoPapel = await prisma.consumoPapel.findMany({
      where: {
        // tipo: tipo ? tipo : undefined,
        sede_id: sedeId ? parseInt(sedeId) : undefined,
      },
      include: {
        tipoPapel: true,
        anio: true,
        sede: true,
        cantidad: true,
      },
      orderBy: {
        [sort ?? "id"]: direction ?? "desc",
      },
    });
    // const formattedConsumoPapel: Combustible[] = [];

    // for (const combustible of combustibles) {
    //     formattedConsumoPapel.push(formatCombustible(combustible));
    // }

    return NextResponse.json(formattedConsumoPapel);
  } catch (error) {
    console.error("Error finding combustibles", error);
    return new NextResponse("Error finding combustibles", { status: 500 });
  }
}
