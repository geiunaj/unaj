import api from "../../../../config/api";
import {
    ConsumoAguaFactorCollectionPaginate,
    ConsumoAguaFactorRequest
} from "./ConsumoAguaFactor.interface";

import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export interface ConsumoAguaFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export async function getConsumoAguaFactorPaginate(
    {
        anioId,
        page = 1,
        perPage = 10
    }: ConsumoAguaFactorIndex
): Promise<ConsumoAguaFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            anioId,
            page,
            perPage
        }
    }
    const {data} = await api.get<ConsumoAguaFactorCollectionPaginate>("/api/consumoAgua/factor", config);
    return data;
}

export async function createConsumoAguaFactor(ConsumoAguaFactor: ConsumoAguaFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/consumoAgua/factor", ConsumoAguaFactor);
}

export async function showConsumoAguaFactor(id: number): Promise<any> {
    const {data} = await api.get(`/api/consumoAgua/factor/${id}`);
    return data;
}

export async function updateConsumoAguaFactor(id: number, body: ConsumoAguaFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/consumoAgua/factor/${id}`, body);
}

export async function deleteConsumoAguaFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/consumoAgua/factor/${id}`);
}