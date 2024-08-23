import api from "../../../../config/api";

import {AxiosRequestConfig} from "axios";
import {CollectionConsumoPapel, ConsumoPapelRequest, ConsumoPapelResource} from "./consumoPapel.interface";


interface Response {
    message: string;
}

export async function getConsumoPapel(
    sedeId?: number,
    anio?: number,
    tipoPapelId?: number,
    sort?: string | null,
    direction?: string,

    page?: number
): Promise<CollectionConsumoPapel> {
    try {
        const config: AxiosRequestConfig = {
            params: {
                sedeId,
                anio,
                tipoPapelId,
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
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los consumos de papel");
    }
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
