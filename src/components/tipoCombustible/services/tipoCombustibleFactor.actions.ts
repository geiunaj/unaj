import api from "../../../../config/api";
import {
    TipoCombustibleFactorCollection,
    TipoCombustibleFactorCollectionPaginate,
    TipoCombustibleFactorRequest
} from "./tipoCombustibleFactor.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export interface TiposCombustibleFactorIndex {
    tipoCombustibleId?: string;
    page?: number;
    perPage?: number;
}

export async function getTiposCombustibleFactorPaginate(
    {
        tipoCombustibleId,
        page = 1,
        perPage = 10
    }: TiposCombustibleFactorIndex
): Promise<TipoCombustibleFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            tipoCombustibleId,
            page,
            perPage
        }
    }
    const {data} = await api.get<TipoCombustibleFactorCollectionPaginate>("/api/tipoCombustible/factor", config);
    return data;
}

export async function createTipoCombustibleFactor(body: TipoCombustibleFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoCombustible", body);
}

export async function showTipoCombustibleFactor(id: number): Promise<any> {
    const {data} = await api.get(`/api/tipoCombustible/${id}`);
    return data;
}

export async function updateTipoCombustibleFactor(id: number, body: TipoCombustibleFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoCombustible/${id}`, body);
}

export async function deleteTipoCombustibleFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoCombustible/${id}`);
}

