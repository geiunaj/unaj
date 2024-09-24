import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {FactorEmisionFertilizanteIndex} from "@/components/tipoFertilizante/lib/tipoFertilizanteFactor.hook";
import {
    FertilizanteFactorCollectionPaginate
} from "@/components/tipoFertilizante/services/tipoFertilizanteFactor.interface";

interface Response {
    message: string;
}


export async function getFactorEmisionFertilizantePage(
    {
        anioId,
        page = 1,
        perPage = 10,
    }: FactorEmisionFertilizanteIndex): Promise<FertilizanteFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
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

export async function deleteTipoFertilizanteFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoFertilizante/${id}`);
}