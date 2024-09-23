import api from "../../../../config/api";
import { FactorEmisionSEINCollectionPaginate, FactorEmisionSEINRequest} from "./factorEmisionSEIN.interface";

import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export interface FactorEmisionSEINIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export async function getFactorEmisionSEINPaginate(
    {
        anioId,
        page = 1,
        perPage = 10
    }: FactorEmisionSEINIndex
): Promise<FactorEmisionSEINCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            anioId,
            page,
            perPage
        }
    }
    const {data} = await api.get<FactorEmisionSEINCollectionPaginate>("/api/electricidad/factor", config);
    return data;
}

export async function createFactorSEIN(factorEmisionSEIN: FactorEmisionSEINRequest ): Promise<AxiosResponse<Response>> {
    return await api.post("/api/electricidad/factor", factorEmisionSEIN);
}

export async function showFactorSEIN(id: number): Promise<any> {
    const {data} = await api.get(`/api/electricidad/factor/${id}`);
    return data;
}

export async function updateFactorSEIN(id: number, body: FactorEmisionSEINRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/electricidad/factor/${id}`, body);
}
