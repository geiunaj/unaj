import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {FactorEmisionConsumibleIndex} from "@/components/tipoConsumible/lib/tipoConsumibleFactor.hook";
import {
    ConsumibleFactorCollectionPaginate, ConsumibleFactorRequest
} from "@/components/tipoConsumible/services/tipoConsumibleFactor.interface";

interface Response {
    message: string;
}


export async function getFactorEmisionConsumiblePage(
    {
        tipoConsumibleId,
        anioId,
        page = 1,
        perPage = 10,
    }: FactorEmisionConsumibleIndex): Promise<ConsumibleFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            tipoConsumibleId,
            anioId,
            page,
            perPage,
        },
    };
    const {data} = await api.get<ConsumibleFactorCollectionPaginate>(
        "/api/tipoConsumible/factor",
        config
    );
    return data;
}

export async function getFactorEmisionConsumibleById(id: number): Promise<any> {
    const {data} = await api.get(`/api/tipoConsumible/factor/${id}`);
    return data;
}

export async function createFactorEmisionConsumible(data: ConsumibleFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoConsumible/factor", data);
}

export async function updateFactorEmisionConsumible(id: number, data: ConsumibleFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoConsumible/factor/${id}`, data);
}

export async function deleteTipoConsumibleFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoConsumible/factor/${id}`);
}