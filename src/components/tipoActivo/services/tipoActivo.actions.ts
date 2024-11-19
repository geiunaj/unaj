import api from "../../../../config/api";
import {
    TipoConsumibleCollection, TipoConsumibleCollectionPaginate,
    TipoConsumibleRequest,
    TipoConsumibleResource,
} from "./tipoConsumible.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {DescripcionConsumible} from "@/components/tipoConsumible/services/descripcionConsumible.interface";
import {GrupoConsumible} from "@/components/tipoConsumible/services/grupoConsumible.interface";
import {CategoriaConsumible} from "@/components/tipoConsumible/services/categoriaConsumible.interface";

interface Response {
    message: string;
}

export async function getTiposConsumible(): Promise<TipoConsumibleCollection[]> {
    const {data} = await api.get<TipoConsumibleCollection[]>("/api/tipoConsumible");
    return data;
}

export async function getTiposConsumiblePaginate(nombre: string = "", page: number = 1): Promise<TipoConsumibleCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            nombre,
            perPage: 10,
            page,
        },
    }
    const {data} = await api.get<TipoConsumibleCollectionPaginate>("/api/tipoConsumible", config);
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

export async function getTipoConsumibleDescripcion(): Promise<DescripcionConsumible[]> {
    const {data} = await api.get<DescripcionConsumible[]>(`/api/tipoConsumible/descripcion`);
    return data;
}

export async function getTipoConsumibleGrupo(): Promise<GrupoConsumible[]> {
    const {data} = await api.get<GrupoConsumible[]>(`/api/tipoConsumible/grupo`);
    return data;
}

export async function getTipoConsumibleCategoria(): Promise<CategoriaConsumible[]> {
    const {data} = await api.get<CategoriaConsumible[]>(`/api/tipoConsumible/categoria`);
    return data;
}

export async function getTipoConsumibleProceso(): Promise<CategoriaConsumible[]> {
    const {data} = await api.get<CategoriaConsumible[]>(`/api/tipoConsumible/proceso`);
    return data;
}