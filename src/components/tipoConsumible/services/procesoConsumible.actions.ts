import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import { ProcesoConsumibleCollection, ProcesoConsumibleCollectionPaginate, ProcesoConsumibleRequest, ProcesoConsumibleResource } from "./procesoConsumible.interface";

interface Response {
    message: string;
}

export async function getProcesoConsumible(): Promise<ProcesoConsumibleCollection[]> {
    const {data} = await api.get<ProcesoConsumibleCollection[]>("/api/tipoConsumible/proceso");
    return data;
}

export async function getProcesoConsumiblePaginate(page: number = 1): Promise<ProcesoConsumibleCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            perPage: 10,
            page,
        },
    }
    const {data} = await api.get<ProcesoConsumibleCollectionPaginate>("/api/tipoConsumible/proceso", config);
    return data;
}

export async function getProcesoConsumibleById(id: number): Promise<ProcesoConsumibleResource> {
    const {data} = await api.get<ProcesoConsumibleResource>(`/api/tipoConsumible/proceso/${id}`);
    return data;
}

export async function createProcesoConsumible(tipoConsumible: ProcesoConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoConsumible/proceso", tipoConsumible);
}

export async function updateProcesoConsumible(id: number, tipoConsumible: ProcesoConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoConsumible/proceso/${id}`, tipoConsumible);
}

export async function deleteProcesoConsumible(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoConsumible/proceso/${id}`);
}