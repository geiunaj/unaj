import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {ConsumibleCollection, ConsumibleRequest, ConsumibleResource} from "./consumible.interface";

interface Response {
    message: string;
}

export async function getConsumible(
    tipoConsumibleId?: number,
    claseConsumible?: string,
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    sort?: string,
    direction?: string,
    page?: number,
): Promise<ConsumibleCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoConsumibleId,
            claseConsumible,
            sedeId,
            yearFrom,
            yearTo,
            sort,
            direction,
            page,
        },
    };
    const {data} = await api.get<ConsumibleCollection>(
        "/api/consumible",
        config
    );
    return data;
}

export async function getConsumibleReport(
    tipoConsumibleId?: number,
    claseConsumible?: string,
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    sort?: string,
    direction?: string,
): Promise<ConsumibleCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoConsumibleId,
            claseConsumible,
            sedeId,
            yearFrom,
            yearTo,
            sort,
            direction,
            all: true,
        },
    };
    const {data} = await api.get<ConsumibleCollection>(
        "/api/consumible",
        config
    );
    return data;
}

export async function getConsumibleById(id: number): Promise<ConsumibleResource> {
    const {data} = await api.get(`/api/consumible/${id}`);
    return data;
}

export async function createConsumible(body: ConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/consumible", body);
}

export async function updateConsumible(id: number, body: ConsumibleRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/consumible/${id}`, body);
}

export async function deleteConsumible(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/consumible/${id}`);
}
