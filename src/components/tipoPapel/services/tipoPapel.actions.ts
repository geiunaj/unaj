import api from "../../../../config/api";
import {TipoPapelCollection} from "./tipoPapel.interface";

export async function getTiposPapel(): Promise<TipoPapelCollection[]> {
    try {
        const {data} = await api.get<TipoPapelCollection[]>("/api/tipoPapel");
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los tipos de papel");
    }
}
