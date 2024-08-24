import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {consumoAguaCalculosCollection} from "@/components/consumoAgua/services/consumoAguaCalculos.interface";

interface Response {
    message: string;
}

interface GetConsumoAguaProps {
    sedeId?: number,
    from?: string,
    to?: string,
    page?: number
    all?: boolean
}

interface CreateCalculosConsumoAguaProps {
    sedeId?: number;
    from?: string,
    to?: string,
}

export async function getConsumoAguaCalculos({
                                                 sedeId,
                                                 from,
                                                 to,
                                                 page,
                                             }: GetConsumoAguaProps)
    : Promise<consumoAguaCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            page
        },
    };
    const {data} = await api.get<consumoAguaCalculosCollection>(
        "/api/consumoAgua/calculate", config);
    return data;
}

export async function getConsumoAguaCalculosReport({
                                                       sedeId,
                                                       from,
                                                       to,
                                                       all = true,
                                                   }: GetConsumoAguaProps)
    : Promise<consumoAguaCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            all
        },
    };
    const {data} = await api.get<consumoAguaCalculosCollection>(
        "/api/consumoAgua/calculate", config);
    return data;
}

export async function createCalculosConsumoAgua({
                                                    sedeId,
                                                    from,
                                                    to,
                                                }: CreateCalculosConsumoAguaProps)
    : Promise<AxiosResponse<Response>> {
    const body = {
        sedeId,
        from,
        to,
    };
    return await api.post("/api/consumoAgua/calculate", body);
}