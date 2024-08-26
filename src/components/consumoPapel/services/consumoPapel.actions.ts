import api from "../../../../config/api";

import {AxiosRequestConfig} from "axios";
import {CollectionConsumoPapel, ConsumoPapelRequest, ConsumoPapelResource} from "./consumoPapel.interface";


interface Response {
    message: string;
}

export async function getConsumoPapel(
    tipoPapelId?: number,
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    sort?: string,
    direction?: string,
    page?: number,

): Promise<CollectionConsumoPapel> {
        const config: AxiosRequestConfig = {
            params: {
                tipoPapelId,
                sedeId,
                yearFrom,
                yearTo,
                sort,
                direction,
                page,
            },
        };
        const {data} = await api.get<CollectionConsumoPapel>(
            "/api/consumoPapel",
            config
        );
        return data;
}

export async function getConsumoPapelReport(
    tipoPapelId?: number,
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    sort?: string,
    direction?: string,
): Promise<CollectionConsumoPapel> {
    const config: AxiosRequestConfig = {
        params: {
            tipoPapelId,
            sedeId,
            yearFrom,
            yearTo,
            sort,
            direction,
            all: true,
        },
    };
    const {data} = await api.get<CollectionConsumoPapel>(
        "/api/consumoPapel",
        config
    );
    return data;
}

export async function createConsumoPapel(body: ConsumoPapelRequest): Promise<any> {
    return await api.post("/api/consumoPapel", body);
}


export async function getConsumoPapelById(id: number): Promise<ConsumoPapelResource> {
    const {data} = await api.get<ConsumoPapelResource>(`/api/consumoPapel/${id}`);
    return data;
}

export async function updateConsumoPapel(id: number, body: ConsumoPapelRequest): Promise<any> {
    return await api.put(`/api/consumoPapel/${id}`, body);
}

export async function deleteConsumoPapel(id: number): Promise<any> {
    return await api.delete(`/api/consumoPapel/${id}`);
}
