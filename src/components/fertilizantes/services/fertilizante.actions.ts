import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {fertilizanteCollection, FertilizanteRequest, fertilizanteResource} from "./fertilizante.interface";

interface Response {
    message: string;
}

export async function getFertilizante(
    tipoFertilizanteId?: number,
    claseFertilizante?: string,
    sedeId?: number,
    anio?: string,
    sort?: string,
    direction?: string,
    page?: number,
    all?: boolean
): Promise<fertilizanteCollection> {
    console.log("all", all);
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            sort,
            direction,
            anio,
            tipoFertilizanteId,
            claseFertilizante,
            page,
            all,
        },
    };
    const {data} = await api.get<fertilizanteCollection>(
        "/api/fertilizante",
        config
    );
    return data;
}

export async function getFertilizanteReport(
    tipoFertilizanteId?: number,
    claseFertilizante?: string,
    sedeId?: number,
    anio?: string,
    sort?: string,
    direction?: string,
    page?: number,
    yearFrom?: string,
    yearTo?: string,
    all = true
): Promise<fertilizanteCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            sort,
            direction,
            anio,
            tipoFertilizanteId,
            claseFertilizante,
            page,
            all,
        },
    };
    const {data} = await api.get<fertilizanteCollection>(
        "/api/fertilizante",
        config
    );
    return data;
}

export async function getFertilizanteById(id: number): Promise<fertilizanteResource> {
    const {data} = await api.get(`/api/fertilizante/${id}`);
    return data;
}

export async function createFertilizante(body: FertilizanteRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/fertilizante", body);
}

export async function updateFertilizante(id: number, body: FertilizanteRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/fertilizante/${id}`, body);
}

export async function deleteFertilizante(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/fertilizante/${id}`);
}
