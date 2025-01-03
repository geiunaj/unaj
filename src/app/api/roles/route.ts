import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import {User} from "@prisma/client";
import {RolRequest} from "@/components/rol/services/rol.interface";

// INDEX (GET)
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const perPage = parseInt(searchParams.get("perPage") ?? "0");
        const page = parseInt(searchParams.get("page") ?? "1");

        const roles = await prisma.typeUser.findMany({
            ...(perPage > 0 ? {skip: (page - 1) * perPage, take: perPage} : {}),
        });

        if (perPage > 0) {
            const totalRecords = await prisma.typeUser.count();
            const totalPages = Math.ceil(totalRecords / perPage);
            return NextResponse.json({
                data: roles,
                meta: {page, perPage, totalRecords, totalPages},
            });
        }

        return NextResponse.json(roles);
    } catch (error) {
        console.error("Error buscando roles", error);
        return new NextResponse("Error buscando roles", {status: 500});
    }
}

// CREATE (POST)
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: RolRequest = await req.json();
        const typeUser = await prisma.typeUser.create({
            data: {
                type_name: body.type_name,
            },
        });

        for (const permiso of body.permisos) {
            await prisma.access.create({
                data: {
                    menu: permiso,
                    type_user_id: typeUser.id,
                },
            });
        }

        return NextResponse.json({
            message: "Rol registrado",
            typeUser,
        });
    } catch (error) {
        console.error("Error registrando rol", error);
        return new NextResponse("Error registrando rol", {status: 500});
    }
}
