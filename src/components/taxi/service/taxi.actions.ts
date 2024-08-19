import api from "../../../../config/api";

import {AxiosRequestConfig} from "axios";
import { TaxiCollection, TaxiRequest } from "./taxi.interface";

export async function getTaxi(
    sedeId?: string,
    mesId?: string,
    sort?: string,
    direction?: string,
    anioId?: string,
): Promise<TaxiCollection[]> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            mesId,
            sort,
            direction,
            anioId,
        },
    };
    const {data} = await api.get<TaxiCollection[]>(
        "/api/taxi",
        config
    );
    return data;
}

export async function getTaxiById(id: number) {
    const {data} = await api.get(`/api/taxi/${id}`);
    return data;
}

export async function createTaxi(body: TaxiRequest) {
    const {data} = await api.post("/api/taxi", body);
    return data;
}

export async function updateTaxi(id: number, body: TaxiRequest) {
    const {data} = await api.put(`/api/taxi/${id}`, body);
    return data;
}

export async function deleteTaxi(id: number) {
    const {data} = await api.delete(`/api/taxi/${id}`);
    return data;
}
