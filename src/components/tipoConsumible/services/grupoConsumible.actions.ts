import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    GrupoConsumibleCollection,
    GrupoConsumibleCollectionPaginate, GrupoConsumibleRequest, GrupoConsumibleResource
} from "@/components/tipoConsumible/services/grupoConsumible.interface";

interface Response {
    message: string;
}

export async function getGrupoConsumible(): Promise<GrupoConsumibleCollection[]> {
    const {data} = await api.get<GrupoConsumibleCollection[]>("/api/tipoConsumible/grupo");
    return data;
}

export async function getGrupoConsumiblePaginate(page: number = 1): Promise<GrupoConsumibleCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            perPage: 10,
            page,
        },
    }
    const {data} = await api.get<GrupoConsumibleCollectionPaginate>("/api/tipoConsumible/grupo", config);
    return data;
}

export async function getGrupoConsumibleById(id: number): Promise<GrupoConsumibleResource> {
    const {data} = await api.get<GrupoConsumibleResource>(`/api/tipoConsumible/grupo/${id}`);
    return data;
}

export async function createGrupoConsumible(tipoConsumible: GrupoConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoConsumible/grupo", tipoConsumible);
}

export async function updateGrupoConsumible(id: number, tipoConsumible: GrupoConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoConsumible/grupo/${id}`, tipoConsumible);
}

export async function deleteGrupoConsumible(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoConsumible/grupo/${id}`);
}