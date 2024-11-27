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

        if (!rol) return NextResponse.json({message: "Rol no encontrado"}, {status: 404});
        return NextResponse.json(formatRol(rol));
    } catch (error) {
        console.error("Error buscando Rol", error);
        return NextResponse.json({message: "Error buscando Rol"}, {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Invalid ID"}, {status: 400});
        if (id === 1) return NextResponse.json({message: "No se puede editar el rol de administrador"}, {status: 400});

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
        return NextResponse.json({message: "Error actualizando rol"}, {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "ID inválido"}, {status: 400});
        if (id === 1) return NextResponse.json({message: "No se puede eliminar el rol de administrador"}, {status: 400});
        const users = await prisma.user.findMany({where: {type_user_id: id},});
        if (users.length > 0) return NextResponse.json({message: "No se puede eliminar el rol porque tiene usuarios asociados"}, {status: 400});
        await prisma.access.deleteMany({where: {type_user_id: id}});
        await prisma.typeUser.delete({where: {id}});
        return NextResponse.json({message: "Rol eliminado correctamente"});
    } catch (error: any) {
        console.error("Error eliminando rol", error);
        return NextResponse.json({message: "Error eliminando rol"}, {status: 500});
    }
}
