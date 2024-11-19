import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    CategoriaActivoCollection,
    CategoriaActivoCollectionPaginate, CategoriaActivoRequest, CategoriaActivoResource
} from "@/components/tipoActivo/services/categoriaActivo.interface";

interface Response {
    message: string;
}

export async function getCategoriaActivo(): Promise<CategoriaActivoCollection[]> {
    const {data} = await api.get<CategoriaActivoCollection[]>("/api/tipoActivo/categoria");
    return data;
}

export async function getCategoriaActivoPaginate(page: number = 1): Promise<CategoriaActivoCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            perPage: 10,
            page,
        },
    }
    const {data} = await api.get<CategoriaActivoCollectionPaginate>("/api/tipoActivo/categoria", config);
    return data;
}

export async function getCategoriaActivoById(id: number): Promise<CategoriaActivoResource> {
    const {data} = await api.get<CategoriaActivoResource>(`/api/tipoActivo/categoria/${id}`);
    return data;
}

export async function createCategoriaActivo(tipoActivo: CategoriaActivoRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoActivo/categoria", tipoActivo);
}

export async function updateCategoriaActivo(id: number, tipoActivo: CategoriaActivoRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoActivo/categoria/${id}`, tipoActivo);
}

export async function deleteCategoriaActivo(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoActivo/categoria/${id}`);
}