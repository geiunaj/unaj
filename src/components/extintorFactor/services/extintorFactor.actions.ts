import api from "../../../../config/api";
import {
    ExtintorFactorCollectionPaginate,
    ExtintorFactorRequest
} from "./extintorFactor.interface";

import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export interface ExtintorFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export async function getExtintorFactorPaginate(
    {
        anioId,
        page = 1,
        perPage = 10
    }: ExtintorFactorIndex
): Promise<ExtintorFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            anioId,
            page,
            perPage
        }
    }
    const {data} = await api.get<ExtintorFactorCollectionPaginate>("/api/extintor/factor", config);
    return data;
}

export async function createExtintorFactor(extintorFactor: ExtintorFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/extintor/factor", extintorFactor);
}

export async function showExtintorFactor(id: number): Promise<any> {
    const {data} = await api.get(`/api/extintor/factor/${id}`);
    return data;
}

export async function updateExtintorFactor(id: number, body: ExtintorFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/extintor/factor/${id}`, body);
}

export async function deleteExtintorFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/extintor/factor/${id}`);
}