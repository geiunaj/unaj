import api from "../../../../config/api";
import { FactorEmisionSEINCollectionPaginate} from "./factorEmisionSEIN.interface";

import {AxiosRequestConfig} from "axios";

interface Response {
    message: string;
}

export interface FactorEmisionSEINIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export async function getFactorEmisionSEINPaginate(
    {
        anioId,
        page = 1,
        perPage = 10
    }: FactorEmisionSEINIndex
): Promise<FactorEmisionSEINCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            anioId,
            page,
            perPage
        }
    }
    const {data} = await api.get<FactorEmisionSEINCollectionPaginate>("/api/electricidad/factor", config);
    return data;
}



