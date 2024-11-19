import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    CategoriaConsumibleCollection,
    CategoriaConsumibleCollectionPaginate, CategoriaConsumibleRequest, CategoriaConsumibleResource
} from "@/components/tipoConsumible/services/categoriaConsumible.interface";

interface Response {
    message: string;
}

export async function getCategoriaConsumible(): Promise<CategoriaConsumibleCollection[]> {
    const {data} = await api.get<CategoriaConsumibleCollection[]>("/api/tipoConsumible/categoria");
    return data;
}

export async function getCategoriaConsumiblePaginate(page: number = 1): Promise<CategoriaConsumibleCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            perPage: 10,
            page,
        },
    }
    const {data} = await api.get<CategoriaConsumibleCollectionPaginate>("/api/tipoConsumible/categoria", config);
    return data;
}

export async function getCategoriaConsumibleById(id: number): Promise<CategoriaConsumibleResource> {
    const {data} = await api.get<CategoriaConsumibleResource>(`/api/tipoConsumible/categoria/${id}`);
    return data;
}

export async function createCategoriaConsumible(tipoConsumible: CategoriaConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoConsumible/categoria", tipoConsumible);
}

export async function updateCategoriaConsumible(id: number, tipoConsumible: CategoriaConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoConsumible/categoria/${id}`, tipoConsumible);
}

export async function deleteCategoriaConsumible(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoConsumible/categoria/${id}`);
}