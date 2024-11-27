import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {formatTransporteAereoFactor} from "@/lib/resources/transporteAereoFactor.resource";
import {
    TransporteAereoFactorRequest
} from "@/components/transporte-aereo-factor/services/transporteAereoFactor.interface";
import {PasswordRequest, ProfileRequest} from "@/components/cuenta/services/account.interface";
import bcrypt from "bcrypt";

export async function POST(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Cuenta inválida"}, {status: 400});
        const body: PasswordRequest = await req.json();
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) return NextResponse.json({message: "Cuenta inválida"}, {status: 400});
        const validPassword = await bcrypt.compare(body.currentPassword, user.password);
        if (!validPassword) return NextResponse.json({message: "Contraseña actual incorrecta"}, {status: 400});
        if (body.newPassword.length < 8) return NextResponse.json({message: "La contraseña debe tener al menos 8 caracteres"}, {status: 400});
        if (body.newPassword !== body.confirmPassword) return NextResponse.json({message: "Las contraseñas no coinciden"}, {status: 400});
        const hashedPassword = await bcrypt.hash(body.newPassword, 10);
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json({message: "Contraseña actualizada",});
    } catch (error) {
        console.error("Error actualizando Contraseña", error);
        return NextResponse.json({message: "Error actualizando Contraseña"}, {status: 500});
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return NextResponse.json({message: "Cuenta inválida"}, {status: 400});
        const body: ProfileRequest = await req.json();
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                name: body.name,
                email: body.email,
            },
        });

        return NextResponse.json({message: "Perfil actualizado",});
    } catch (error) {
        console.error("Error actualizando Perfil", error);
        return NextResponse.json({message: "Error actualizando Perfil"}, {status: 500});
    }
}
