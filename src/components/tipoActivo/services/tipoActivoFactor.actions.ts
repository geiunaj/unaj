import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {FactorEmisionActivoIndex} from "@/components/tipoActivo/lib/tipoActivoFactor.hook";
import {
    ActivoFactorCollectionPaginate, ActivoFactorRequest
} from "@/components/tipoActivo/services/tipoActivoFactor.interface";

interface Response {
    message: string;
}


export async function getFactorEmisionActivoPage(
    {
        tipoActivoId,
        anioId,
        page = 1,
        perPage = 10,
    }: FactorEmisionActivoIndex): Promise<ActivoFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            tipoActivoId,
            anioId,
            page,
            perPage,
        },
    };
    const {data} = await api.get<ActivoFactorCollectionPaginate>(
        "/api/tipoActivo/factor",
        config
    );
    return data;
}

export async function getFactorEmisionActivoById(id: number): Promise<any> {
    const {data} = await api.get(`/api/tipoActivo/factor/${id}`);
    return data;
}

export async function createFactorEmisionActivo(data: ActivoFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoActivo/factor", data);
}

export async function updateFactorEmisionActivo(id: number, data: ActivoFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoActivo/factor/${id}`, data);
}

export async function deleteTipoActivoFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoActivo/factor/${id}`);
}