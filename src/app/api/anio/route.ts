export const dynamic = 'force-dynamic';
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";


export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const anios = await prisma.anio.findMany({
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.anio.count();
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: anios,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(anios);
    } catch (error) {
        console.error("Error buscando Años", error);
        return new NextResponse("Error buscando Años", {status: 500});
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();
        const anioExist = await prisma.anio.findFirst({
            where: {
                nombre: body.nombre
            }
        });
        if (anioExist) return new NextResponse("Año ya registrado", {status: 400});

        const anio = await prisma.anio.create({
            data: {
                nombre: body.nombre,
                created_at: new Date(),
                updated_at: new Date
            },
        });
        return NextResponse.json(anio);
    } catch (error) {
        console.error("Error creando Año", error);
        return new NextResponse("Error creando Año", {status: 500});
    }
}