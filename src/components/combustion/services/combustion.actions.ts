import api from "../../../../config/api";
import {
    CombustionCollection,
    CombustionRequest,
} from "./combustion.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export async function getCombustion(
    tipo: string = "estacionaria",
    tipoCombustibleId?: number,
    sedeId?: number,
    anio?: number,
    mesId?: number,
    sort?: string,
    direction?: string,
): Promise<CombustionCollection[]> {
    const config: AxiosRequestConfig = {
        params: {
            tipo,
            tipoCombustibleId,
            sedeId,
            anio,
            mesId,
            sort,
            direction,
        },
    };
    const {data} = await api.get<CombustionCollection[]>(
        "/api/combustion",
        config
    );
    return data;
}

export async function getCombustionById(id: number) {
    const {data} = await api.get(`/api/combustion/${id}`);
    return data;
}

export async function createCombustion(body: CombustionRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/combustion", body);
}

export async function updateCombustion(id: number, body: CombustionRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/combustion/${id}`, body);
}

export async function deleteCombustion(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/combustion/${id}`);
}
