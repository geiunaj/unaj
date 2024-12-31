import api from "../../../../config/api";
import {
    TaxiFactorCollectionPaginate,
    TaxiFactorRequest
} from "./TaxiFactor.interface";

import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export interface TaxiFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export async function getTaxiFactorPaginate(
    {
        anioId,
        page = 1,
        perPage = 10
    }: TaxiFactorIndex
): Promise<TaxiFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            anioId,
            page,
            perPage
        }
    }
    const {data} = await api.get<TaxiFactorCollectionPaginate>("/api/taxi/factor", config);
    return data;
}

export async function createTaxiFactor(TaxiFactor: TaxiFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/taxi/factor", TaxiFactor);
}

export async function showTaxiFactor(id: number): Promise<any> {
    const {data} = await api.get(`/api/taxi/factor/${id}`);
    return data;
}

export async function updateTaxiFactor(id: number, body: TaxiFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/taxi/factor/${id}`, body);
}

export async function deleteTaxiFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/taxi/factor/${id}`);
}