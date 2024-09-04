import api from "../../../../config/api";
import {
    TipoCombustibleCollection,
    TipoCombustibleCollectionPaginate,
    TipoCombustibleRequest
} from "./tipoCombustible.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export interface TiposCombustibleIndex {
    tipoCombustibleId?: string;
    page?: number;
    perPage?: number;
}

export async function getTiposCombustible(): Promise<
    TipoCombustibleCollection[]
> {
    const {data} = await api.get<TipoCombustibleCollection[]>(
        "/api/tipoCombustible"
    );
    return data;
}

export async function getTiposCombustiblePaginate(
    {
        tipoCombustibleId,
        page = 1,
        perPage = 10
    }: TiposCombustibleIndex
): Promise<TipoCombustibleCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            tipoCombustibleId,
            page,
            perPage
        }
    }
    const {data} = await api.get<TipoCombustibleCollectionPaginate>("/api/tipoCombustible", config);
    return data;
}

export async function createTipoCombustible(body: TipoCombustibleRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoCombustible", body);
}

export async function showTipoCombustible(id: number): Promise<any> {
    const {data} = await api.get(`/api/tipoCombustible/${id}`);
    return data;
}

export async function updateTipoCombustible(id: number, body: TipoCombustibleRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoCombustible/${id}`, body);
}

export async function deleteTipoCombustible(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoCombustible/${id}`);
}

