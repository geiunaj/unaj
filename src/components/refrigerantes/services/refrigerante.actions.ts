import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {RefrigeranteCollection, RefrigeranteRequest, RefrigeranteResource} from "./refrigerante.interface";

interface Response {
    message: string;
}

export async function getRefrigerante(
    tipoRefrigeranteId?: number,
    claseRefrigerante?: string,
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    sort?: string,
    direction?: string,
    page?: number,
): Promise<RefrigeranteCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoRefrigeranteId,
            claseRefrigerante,
            sedeId,
            yearFrom,
            yearTo,
            sort,
            direction,
            page,
        },
    };
    const {data} = await api.get<RefrigeranteCollection>(
        "/api/refrigerante",
        config
    );
    return data;
}

export async function getRefrigeranteReport(
    tipoRefrigeranteId?: number,
    claseRefrigerante?: string,
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    sort?: string,
    direction?: string,
): Promise<RefrigeranteCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoRefrigeranteId,
            claseRefrigerante,
            sedeId,
            yearFrom,
            yearTo,
            sort,
            direction,
            all: true,
        },
    };
    const {data} = await api.get<RefrigeranteCollection>(
        "/api/refrigerante",
        config
    );
    return data;
}

export async function getRefrigeranteById(id: number): Promise<RefrigeranteResource> {
    const {data} = await api.get(`/api/refrigerante/${id}`);
    return data;
}

export async function createRefrigerante(body: RefrigeranteRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/refrigerante", body);
}

export async function updateRefrigerante(id: number, body: RefrigeranteRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/refrigerante/${id}`, body);
}

export async function deleteRefrigerante(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/refrigerante/${id}`);
}
