import {Sede} from "@prisma/client";
import api from "../../../../config/api";
import {
    ClaseConsumible,
    TipoConsumible,
    TipoConsumibleCollection,
    TipoConsumibleRequest,
    TipoConsumibleResource,
} from "./tipoConsumible.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export async function getTiposConsumible(): Promise<TipoConsumibleCollection[]> {
    const {data} = await api.get<TipoConsumibleCollection[]>("/api/tipoConsumible");
    return data;
}

export async function getTipoConsumibleById(
    id: number
): Promise<TipoConsumibleResource> {
    const {data} = await api.get<TipoConsumibleResource>(
        `/api/tipoConsumible/${id}`
    );
    return data;
}

export async function getClaseConsumible(): Promise<ClaseConsumible[]> {
    try {
        const {data} = await api.get<ClaseConsumible[]>(
            "/api/tipoConsumible/clase"
        );
        return data;
    } catch (error) {
        console.error("Error en getClaseConsumible: ", error);
        return [];
    }
}

export async function createTipoConsumible(
    tipoConsumible: TipoConsumibleRequest
): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoConsumible", tipoConsumible);
}

export async function updateTipoConsumible(
    id: number,
    tipoConsumible: TipoConsumibleRequest
): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoConsumible/${id}`, tipoConsumible);
}

export async function deleteTipoConsumible(
    id: number
): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoConsumible/${id}`);
}