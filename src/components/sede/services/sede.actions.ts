import {Sede} from "@prisma/client";
import api from "../../../../config/api";

export async function getSedes(): Promise<Sede[]> {
    try {
        const {data} = await api.get<Sede[]>("/api/sede");
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener las sedes");
    }
}
