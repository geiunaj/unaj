import api from "../../../../config/api";
import {TipoPapelCollection, TipoPapelRequest} from "./tipoPapel.interface";

export async function getTiposPapel(): Promise<TipoPapelCollection[]> {
    try {
        const {data} = await api.get<TipoPapelCollection[]>("/api/tipoPapel");
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los tipos de papel");
    }
}

export async function createTipoPapel(tipoPapel: TipoPapelRequest): Promise<void> {
    try {
        await api.post("/api/tipoPapel", tipoPapel);
    } catch (error) {
        console.error(error);
        throw new Error("Error al crear el tipo de papel");
    }
}

export async function getTipoPapel(id: number): Promise<TipoPapelCollection> {
    try {
        const {data} = await api.get<TipoPapelCollection>(`/api/tipoPapel/${id}`);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener el tipo de papel");
    }
}

export async function updateTipoPapel(tipoPapel: any): Promise<void> {
    try {
        await api.put(`/api/tipoPapel/${tipoPapel.id}`, tipoPapel);
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar el tipo de papel");
    }
}

export async function deleteTipoPapel(id: number): Promise<void> {
    try {
        await api.delete(`/api/tipoPapel/${id}`);
    } catch (error) {
        console.error(error);
        throw new Error("Error al eliminar el tipo de papel");
    }
}