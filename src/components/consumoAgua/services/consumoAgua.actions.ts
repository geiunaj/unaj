import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {consumoAguaCollection, consumoAguaRequest} from "./consumoAgua.interface";


interface Response {
    message: string;
}

export async function getConsumoAgua(
    sedeId?: number,
    areaId?: number,
    mesId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
    page?: number,
): Promise<consumoAguaCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            areaId,
            mesId,
            from,
            to,
            sort,
            direction,
            page,
        },
    };
    const {data} = await api.get<consumoAguaCollection>(
        "/api/consumoAgua",
        config
    );
    return data;
}

export async function getConsumoAguaReport(
    sedeId?: number,
    areaId?: number,
    mesId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
    page?: number
): Promise<consumoAguaCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            areaId,
            mesId,
            from,
            to,
            sort,
            direction,
            page,
            all: true,
        },
    };
    const {data} = await api.get<consumoAguaCollection>(
        "/api/consumoAgua",
        config
    );
    return data;
}


export async function getConsumoAguaById(id: number) {
    const {data} = await api.get(`/api/consumoAgua/${id}`);
    return data;
}

export async function createConsumoAgua(tipoPapel: consumoAguaRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/consumoAgua", tipoPapel);
}

export async function updateConsumoAgua(id: number, body: consumoAguaRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/consumoAgua/${id}`, body);
}

export async function deleteConsumoAgua(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/consumoAgua/${id}`);
}
