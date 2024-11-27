import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {AreaRequest} from "@/components/area/services/area.interface";
import {formatArea} from "@/lib/resources/areaResource";
import {formatRol} from "@/lib/resources/rolResource";
import {RolRequest} from "@/components/rol/services/rol.interface";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Invalid ID"}, {status: 404});
        const rol = await prisma.typeUser.findUnique({
            where: {
                id: id,
            },
            include: {
                access: true,
            }
        });

        if (!rol) return new NextResponse("Area no encontrada", {status: 404});
        return NextResponse.json(formatRol(rol));
    } catch (error) {
        console.error("Error buscando area", error);
        return new NextResponse("Error buscando area", {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Invalid ID"}, {status: 400});

        const body: RolRequest = await req.json();

        const typeUser = await prisma.typeUser.update({
            where: {id},
            data: {
                type_name: body.type_name,
            },
        });

        await prisma.access.deleteMany({where: {type_user_id: id}});
        for (const permiso of body.permisos) {
            await prisma.access.create({
                data: {
                    menu: permiso,
                    type_user_id: typeUser.id,
                },
            });
        }

        return NextResponse.json({
            message: "Rol actualizado",
            typeUser,
        });
    } catch (error) {
        console.error("Error actualizando rol", error);
        return new NextResponse("Error actualizando rol", {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return new NextResponse("ID inválido", {status: 400});

        await prisma.area.delete({
            where: {id},
        });

        return NextResponse.json({
            message: "Area eliminada correctamente",
        });
    } catch (error: any) {
        console.error("Error eliminando area", error);
        return new NextResponse("Error eliminando area", {status: 500});
    }
}
