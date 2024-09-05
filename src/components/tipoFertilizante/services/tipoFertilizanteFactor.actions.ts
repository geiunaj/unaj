import {Sede} from "@prisma/client";
import api from "../../../../config/api";
import {
    ClaseFertilizante,
    TipoFertilizanteFactor,
    TipoFertilizanteFactorCollection,
    TipoFertilizanteFactorRequest, TipoFertilizanteFactorResource
} from "./tipoFertilizante.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export async function getTiposFertilizanteFactor(clase?: string): Promise<TipoFertilizanteFactorCollection[]> {
    const config: AxiosRequestConfig = {
        params: {
            clase
        },
    };
    const {data} = await api.get<TipoFertilizanteFactorCollection[]>("/api/tipoFertilizante", config);
    return data;
}

export async function getTipoFertilizanteFactorById(id: number): Promise<TipoFertilizanteFactorResource> {
    const {data} = await api.get<TipoFertilizanteFactorResource>(`/api/tipoFertilizante/${id}`);
    return data;
}

export async function getClaseFertilizante(): Promise<ClaseFertilizante[]> {
    try {
        const {data} = await api.get<ClaseFertilizante[]>("/api/tipoFertilizante/clase");
        return data;
    } catch (error) {
        console.error("Error en getClaseFertilizante: ", error);
        return [];
    }
}

export async function createTipoFertilizanteFactor(tipoFertilizante: TipoFertilizanteFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoFertilizante", tipoFertilizante);
}

export async function updateTipoFertilizanteFactor(id: number, tipoFertilizante: TipoFertilizanteFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoFertilizante/${id}`, tipoFertilizante);
}

export async function deleteTipoFertilizanteFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoFertilizante/${id}`);
}