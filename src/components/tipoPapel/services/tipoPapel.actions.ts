import api from "../../../../config/api";
import {TipoPapelCollection, TipoPapelRequest} from "./tipoPapel.interface";
import {AxiosResponse} from "axios";

interface Response {
    message: string;
}

export async function getTiposPapel(): Promise<TipoPapelCollection[]> {
    try {
        const {data} = await api.get<TipoPapelCollection[]>("/api/tipoPapel");
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los tipos de papel");
    }
}

export async function getTiposDePapel(): Promise<TipoPapelCollection[]> {
    try {
        const {data} = await api.get<TipoPapelCollection[]>("/api/tipoPapel");
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los tipos de papel");
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

export async function createTipoPapel(tipoPapel: TipoPapelRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoPapel", tipoPapel);
}

export async function updateTipoPapel(id: number, tipoPapel: TipoPapelRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoPapel/${id}`, tipoPapel);
}

export async function deleteTipoPapel(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoPapel/${id}`);
}