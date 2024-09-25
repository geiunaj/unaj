import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {FactorEmisionConsumibleIndex} from "@/components/tipoConsumible/lib/tipoConsumibleFactor.hook";
import {
    ConsumibleFactorCollectionPaginate
} from "@/components/tipoConsumible/services/tipoConsumibleFactor.interface";

interface Response {
    message: string;
}


export async function getFactorEmisionConsumiblePage(
    {
        anioId,
        page = 1,
        perPage = 10,
    }: FactorEmisionConsumibleIndex): Promise<ConsumibleFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
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

export async function deleteTipoConsumibleFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoConsumible/${id}`);
}