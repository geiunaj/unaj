import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {FactorEmisionFertilizanteIndex} from "@/components/tipoFertilizante/lib/tipoFertilizanteFactor.hook";
import {
    FertilizanteFactorCollectionPaginate,
    FertilizanteFactorRequest
} from "@/components/tipoFertilizante/services/tipoFertilizanteFactor.interface";

interface Response {
    message: string;
}


export async function getFactorEmisionFertilizantePage(
    {
        tipoFertilizanteId,
        anioId,
        page = 1,
        perPage = 10,
    }: FactorEmisionFertilizanteIndex): Promise<FertilizanteFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            tipoFertilizanteId,
            anioId,
            page,
            perPage,
        },
    };
    const {data} = await api.get<FertilizanteFactorCollectionPaginate>(
        "/api/tipoFertilizante/factor",
        config
    );
    return data;
}

export async function createTipoFertilizanteFactor(tipoFertilizanteFactor: FertilizanteFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoFertilizante/factor", tipoFertilizanteFactor);
}

export async function showTipoFertilizanteFactor(id: number): Promise<any> {
    const {data} = await api.get(`/api/tipoFertilizante/factor/${id}`);
    return data;
}

export async function updateTipoFertilizanteFactor(id: number, body: FertilizanteFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoFertilizante/factor/${id}`, body);
}

export async function deleteTipoFertilizanteFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoFertilizante/factor/${id}`);
}