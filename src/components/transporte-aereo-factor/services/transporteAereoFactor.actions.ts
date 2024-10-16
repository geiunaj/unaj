import api from "../../../../config/api";
import {TransporteAereoFactorCollectionPaginate, TransporteAereoFactorRequest} from "./transporteAereoFactor.interface";

import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export interface TransporteAereoFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export async function getTransporteAereoFactorPaginate(
    {
        anioId,
        page = 1,
        perPage = 10
    }: TransporteAereoFactorIndex
): Promise<TransporteAereoFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            anioId,
            page,
            perPage
        }
    }
    const {data} = await api.get<TransporteAereoFactorCollectionPaginate>("/api/transporteAereo/factor", config);
    return data;
}

export async function createTransporteAereoFactor(transporteAereoFactor: TransporteAereoFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/transporteAereo/factor", transporteAereoFactor);
}

export async function showTransporteAereoFactor(id: number): Promise<any> {
    const {data} = await api.get(`/api/transporteAereo/factor/${id}`);
    return data;
}

export async function updateTransporteAereoFactor(id: number, body: TransporteAereoFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/transporteAereo/factor/${id}`, body);
}

export async function deleteTransporteAereoFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/transporteAereo/factor/${id}`);
}