import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import prisma from "@/lib/prisma";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export async function getAnioId(nombre: string): Promise<number | undefined> {
    const anio = await prisma.anio.findFirst({
        where: {nombre: nombre},
    });
    return anio?.id ?? undefined;
}