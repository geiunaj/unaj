import api from "../../../../config/api";
import {tipoPapel} from "./tipoPapel.interface";

export async function getTiposPapel(): Promise<tipoPapel[]> {
    try {
        const {data} = await api.get<tipoPapel[]>("/api/tipoPapel");
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los tipos de papel");
    }
}
