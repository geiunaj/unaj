import api from "../../../../config/api";

import {AxiosRequestConfig} from "axios";
import {CollectionConsumoPapel, ConsumoPapelRequest} from "./consumoPapel.interface";

export async function getConsumoPapel(
    sedeId?: string,
    tipoPapelId?: string,
    anio?: string,
    sort?: string,
    direction?: string
): Promise<CollectionConsumoPapel[]> {
    try {
        const config: AxiosRequestConfig = {
            params: {
                sedeId,
                tipoPapelId,
                anio,
                sort,
                direction,
            },
        };
        const {data} = await api.get<CollectionConsumoPapel[]>(
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
    const {data} = await api.post("/api/consumoPapel", body);
    return data;
}

export async function showConsumoPapel(id: number): Promise<any> {
    const {data} = await api.get(`/api/consumoPapel/${id}`);
    return data;
}

export async function updateConsumoPapel(id: number, body: ConsumoPapelRequest): Promise<any> {
    const {data} = await api.put(`/api/consumoPapel/${id}`, body);
    return data;
}

export async function deleteConsumoPapel(id: number): Promise<any> {
    const {data} = await api.delete(`/api/consumoPapel/${id}`);
    return data;
}
