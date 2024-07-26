import api from "../../../../config/api";
import {
    CombustionCollection,
    CombustionRequest,
} from "./combustion.interface";
import {AxiosRequestConfig} from "axios";

export async function getCombustion(
    tipo: string = "estacionaria",
    sedeId?: number,
    sort?: string,
    direction?: string,
    anioId?: number,
    tipoCombustibleId?: number
): Promise<CombustionCollection[]> {
    const config: AxiosRequestConfig = {
        params: {
            tipo, sedeId, sort, direction, anioId, tipoCombustibleId,
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

export async function createCombustion(body: CombustionRequest) {
    const {data} = await api.post("/api/combustion", body);
    return data;
}

export async function updateCombustion(id: number, body: CombustionRequest) {
    const {data} = await api.put(`/api/combustion/${id}`, body);
    return data;
}

export async function deleteCombustion(id: number) {
    const {data} = await api.delete(`/api/combustion/${id}`);
    return data;
}
