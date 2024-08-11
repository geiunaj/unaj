import {Anio} from "@prisma/client";
import api from "../../../../config/api";

export async function getAnio(): Promise<Anio[]> {
    try {
        const {data} = await api.get<Anio[]>("/api/anio");
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los años");
    }
}
