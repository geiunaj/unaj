import api from "../../../../config/api";
import {
    TransporteTerrestreFactorCollectionPaginate,
    TransporteTerrestreFactorRequest
} from "./transporteTerrestreFactor.interface";

import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export interface TransporteTerrestreFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export async function getTransporteTerrestreFactorPaginate(
    {
        anioId,
        page = 1,
        perPage = 10
    }: TransporteTerrestreFactorIndex
): Promise<TransporteTerrestreFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            anioId,
            page,
            perPage
        }
    }
    const {data} = await api.get<TransporteTerrestreFactorCollectionPaginate>("/api/transporteTerrestre/factor", config);
    return data;
}

export async function createTransporteTerrestreFactor(transporteTerrestreFactor: TransporteTerrestreFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/transporteTerrestre/factor", transporteTerrestreFactor);
}

export async function showTransporteTerrestreFactor(id: number): Promise<any> {
    const {data} = await api.get(`/api/transporteTerrestre/factor/${id}`);
    return data;
}

export async function updateTransporteTerrestreFactor(id: number, body: TransporteTerrestreFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/transporteTerrestre/factor/${id}`, body);
}

export async function deleteTransporteTerrestreFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/transporteTerrestre/factor/${id}`);
}