import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {FactorEmisionPapelIndex} from "@/components/tipoPapel/lib/tipoPapelFactor.hook";
import {
    PapelFactorCollectionPaginate, PapelFactorRequest
} from "@/components/tipoPapel/services/tipoPapelFactor.interface";

interface Response {
    message: string;
}


export async function getFactorEmisionPapelPage(
    {
        tipoPapelId,
        anioId,
        page = 1,
        perPage = 10,
    }: FactorEmisionPapelIndex): Promise<PapelFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            tipoPapelId,
            anioId,
            page,
            perPage,
        },
    };
    const {data} = await api.get<PapelFactorCollectionPaginate>(
        "/api/tipoPapel/factor",
        config
    );
    return data;
}

export async function getFactorEmisionPapelById(id: number): Promise<any> {
    const {data} = await api.get(`/api/tipoPapel/factor/${id}`);
    return data;
}

export async function createFactorEmisionPapel(data: PapelFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoPapel/factor", data);
}

export async function updateFactorEmisionPapel(id: number, data: PapelFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoPapel/factor/${id}`, data);
}

export async function deleteTipoPapelFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoPapel/factor/${id}`);
}