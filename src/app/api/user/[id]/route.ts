import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatUser} from "@/lib/resources/userResource";
import {UserRequest} from "@/components/user/services/user.interface";
import bcrypt from "bcrypt";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Invalid ID"}, {status: 404});
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) return NextResponse.json({message: "Usuario no encontrado"}, {status: 404});
        return NextResponse.json(formatUser(user));
    } catch (error) {
        console.error("Error buscando Usuario", error);
        return NextResponse.json({message: "Error buscando Usuario"}, {status: 500});
    }
}

export async function PUT(req: NextRequest, {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Invalid ID"}, {status: 400});

        const body: UserRequest = await req.json();
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await prisma.user.update({
            where: {id},
            data: {
                name: body.nombre,
                email: body.email,
                telefono: body.telefono,
                password: hashedPassword,
                sede_id: body.sede_id,
                type_user_id: body.type_user_id,
            },
        });

        return NextResponse.json({
            message: "User actualizado",
            user,
        });
    } catch (error) {
        console.error("Error actualizando user", error);
        return NextResponse.json({message: "Error actualizando user"}, {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "ID inválido"}, {status: 400});
        if (id === 1) return NextResponse.json({message: "No se puede eliminar el user de administrador"}, {status: 400});
        const users = await prisma.user.findMany({where: {type_user_id: id},});
        if (users.length > 0) return NextResponse.json({message: "No se puede eliminar el user porque tiene usuarios asociados"}, {status: 400});
        await prisma.access.deleteMany({where: {type_user_id: id}});
        await prisma.user.delete({where: {id}});
        return NextResponse.json({message: "User eliminado correctamente"});
    } catch (error: any) {
        console.error("Error eliminando user", error);
        return NextResponse.json({message: "Error eliminando user"}, {status: 500});
    }
}
