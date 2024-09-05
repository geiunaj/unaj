import {Sede} from "@prisma/client";
import api from "../../../../config/api";
import {
    ClaseFertilizante,
    TipoFertilizante,
    TipoFertilizanteCollection,
    TipoFertilizanteRequest,
    TipoFertilizanteResource,
} from "./tipoFertilizante.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {FactorEmisionFertilizanteIndex} from "../lib/tipoFertilizanteFactor.hook";
import {FertilizanteFactorCollectionPaginate} from "./tipoFertilizanteFactor.interface";

interface Response {
    message: string;
}

export async function getTiposFertilizante(
    clase?: string
): Promise<TipoFertilizanteCollection[]> {
    const config: AxiosRequestConfig = {
        params: {
            clase,
        },
    };
    const {data} = await api.get<TipoFertilizanteCollection[]>(
        "/api/tipoFertilizante",
        config
    );
    return data;
}

export async function getTipoFertilizanteById(
    id: number
): Promise<TipoFertilizanteResource> {
    const {data} = await api.get<TipoFertilizanteResource>(
        `/api/tipoFertilizante/${id}`
    );
    return data;
}

export async function getClaseFertilizante(): Promise<ClaseFertilizante[]> {
    try {
        const {data} = await api.get<ClaseFertilizante[]>(
            "/api/tipoFertilizante/clase"
        );
        return data;
    } catch (error) {
        console.error("Error en getClaseFertilizante: ", error);
        return [];
    }
}

export async function createTipoFertilizante(
    tipoFertilizante: TipoFertilizanteRequest
): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoFertilizante", tipoFertilizante);
}

export async function updateTipoFertilizante(
    id: number,
    tipoFertilizante: TipoFertilizanteRequest
): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoFertilizante/${id}`, tipoFertilizante);
}

export async function deleteTipoFertilizante(
    id: number
): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoFertilizante/${id}`);
}