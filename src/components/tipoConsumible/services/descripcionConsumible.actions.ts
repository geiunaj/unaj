import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    DescripcionConsumibleCollection,
    DescripcionConsumibleCollectionPaginate, DescripcionConsumibleRequest, DescripcionConsumibleResource
} from "@/components/tipoConsumible/services/descripcionConsumible.interface";

interface Response {
    message: string;
}

export async function getDescripcionConsumible(): Promise<DescripcionConsumibleCollection[]> {
    const {data} = await api.get<DescripcionConsumibleCollection[]>("/api/tipoConsumible/descripcion");
    return data;
}

export async function getDescripcionConsumiblePaginate(page: number = 1): Promise<DescripcionConsumibleCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            perPage: 10,
            page,
        },
    }
    const {data} = await api.get<DescripcionConsumibleCollectionPaginate>("/api/tipoConsumible/descripcion", config);
    return data;
}

export async function getDescripcionConsumibleById(id: number): Promise<DescripcionConsumibleResource> {
    const {data} = await api.get<DescripcionConsumibleResource>(`/api/tipoConsumible/descripcion/${id}`);
    return data;
}

export async function createDescripcionConsumible(tipoConsumible: DescripcionConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoConsumible/descripcion", tipoConsumible);
}

export async function updateDescripcionConsumible(id: number, tipoConsumible: DescripcionConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoConsumible/descripcion/${id}`, tipoConsumible);
}

export async function deleteDescripcionConsumible(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoConsumible/descripcion/${id}`);
}