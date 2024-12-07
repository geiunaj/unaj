import api from "../../../../config/api";
import {Sedes, SedesRequest} from "@/components/sedes/services/sedes.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export async function getSedes(
    sedeId?: number
): Promise<Sedes[]> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
        },
    }
    const {data} = await api.get<Sedes[]>("/api/sedes", config);
    return data;
}

export async function getSedesById(id: number): Promise<Sedes> {
    const {data} = await api.get<Sedes>(`/api/sedes/${id}`);
    return data;
}

export async function createSedes(sedes: SedesRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/sedes", sedes);
}

export async function updateSedes(id: number, sedes: SedesRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/sedes/${id}`, sedes);
}

export async function deleteSedes(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/sedes/${id}`);
}