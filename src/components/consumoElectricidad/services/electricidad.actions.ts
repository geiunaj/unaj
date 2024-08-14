import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    electricidadCollection,
    electricidadRequest,
} from "./electricidad.interface";

interface Response {
    message: string;
}

export async function getElectricidad(
    sedeId: number,
    anioId: number,
    areaId: number,
    mesId?: number,
    sort?: string,
    direction?: string,
): Promise<electricidadCollection[]> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            anioId,
            areaId,
            sort,
            direction,
            mesId,
        },
    };
    const {data} = await api.get<electricidadCollection[]>(
        "/api/electricidad",
        config
    );
    return data;
}


export async function getElectricidadById(id: number) {
    const {data} = await api.get(`/api/electricidad/${id}`);
    return data;
}

export async function createElectricidad(tipoPapel: electricidadRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/electricidad", tipoPapel);
}

export async function updateElectricidad(id: number, body: electricidadRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/electricidad/${id}`, body);
}



export async function deleteElectricidad(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/electricidad/${id}`);

}
