import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const id = parseInt(searchParams.get("id") ?? "0");
        if (isNaN(id)) return NextResponse.json({message: "Id no válido"}, {status: 400});
        const user = await prisma.user.findUnique({
            where: {id}
        });
        if (!user) return NextResponse.json({message: "Usuario no encontrado"}, {status: 404});
        const permisos = await prisma.access.findMany({
            where: {
                type_user_id: user.type_user_id
            }
        });
        return NextResponse.json(permisos.map(permiso => permiso.menu));
    } catch (error) {
        console.error("Error buscando Permisos", error);
        return new NextResponse("Error buscando Permisos", {status: 500});
    }
}