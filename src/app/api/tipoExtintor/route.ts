import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
    TipoExtintor,
    TipoExtintorRequest,
} from "@/components/tipoExtintor/services/tipoExtintor.interface";
import {formatTipoExtintor} from "@/lib/resources/tipoExtintorResource";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");
        const nombre = searchParams.get("nombre") ?? "";
        const tiposExtintor = await prisma.tipoExtintor.findMany({
            where: {
                nombre: {
                    contains: nombre,
                },
            },
            orderBy: {nombre: "asc"},
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });
        if (perPage > 0) {
            const totalRecords = await prisma.tipoExtintor.count({
                where: {
                    nombre: {
                        contains: nombre,
                    },
                },
            });
            const totalPages = Math.ceil(totalRecords / perPage);
            const tiposExtintorFormatted: any[] = tiposExtintor.map((extintor, index) => {
                const newExtintor = formatTipoExtintor(extintor);
                newExtintor.rn = (page - 1) * perPage + index + 1;
                return newExtintor;
            });
            return NextResponse.json({
                data: tiposExtintorFormatted,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }
        const formattedTipoExtintores: TipoExtintor[] =
            tiposExtintor.map(formatTipoExtintor);
        return NextResponse.json(formattedTipoExtintores);
    } catch (error) {
        console.error("Error buscando tipos de extintor", error);
        return NextResponse.json(
            {message: "Error buscando tipos de extintor"},
            {status: 500}
        );
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: TipoExtintorRequest = await req.json();
        const tipoExtintor = await prisma.tipoExtintor.create({
            data: {
                nombre: body.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({
            message: "Tipo de Extintor Creado",
            tipoExtintor: tipoExtintor,
        });
    } catch (error) {
        console.error("Error creando Tipo de Extintor", error);
        return NextResponse.json(
            {message: "Error creando Tipo de Extintor"},
            {status: 500}
        );
    }
}
