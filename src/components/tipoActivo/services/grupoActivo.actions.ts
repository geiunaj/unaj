import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    GrupoActivoCollection,
    GrupoActivoCollectionPaginate, GrupoActivoRequest, GrupoActivoResource
} from "@/components/tipoActivo/services/grupoActivo.interface";

interface Response {
    message: string;
}

export async function getGrupoActivo(): Promise<GrupoActivoCollection[]> {
    const {data} = await api.get<GrupoActivoCollection[]>("/api/tipoActivo/grupo");
    return data;
}

export async function getGrupoActivoPaginate(page: number = 1): Promise<GrupoActivoCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            perPage: 10,
            page,
        },
    }
    const {data} = await api.get<GrupoActivoCollectionPaginate>("/api/tipoActivo/grupo", config);
    return data;
}

export async function getGrupoActivoById(id: number): Promise<GrupoActivoResource> {
    const {data} = await api.get<GrupoActivoResource>(`/api/tipoActivo/grupo/${id}`);
    return data;
}

export async function createGrupoActivo(tipoActivo: GrupoActivoRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoActivo/grupo", tipoActivo);
}

export async function updateGrupoActivo(id: number, tipoActivo: GrupoActivoRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoActivo/grupo/${id}`, tipoActivo);
}

export async function deleteGrupoActivo(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoActivo/grupo/${id}`);
}