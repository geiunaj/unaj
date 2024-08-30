import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    electricidadCollection,
    electricidadRequest,
} from "./electricidad.interface";
import {
    electricidadCalculosCollection,
    electricidadCalculosRequest
} from "@/components/consumoElectricidad/services/electricidadCalculos.interface";

interface Response {
    message: string;
}

interface GetElectricidadProps {
    sedeId?: number,
    from?: string,
    to?: string,
    page?: number
}

interface CreateCalculosElectricidadProps {
    sedeId?: number;
    from?: string;
    to?: string;
}

export async function getElectricidadCalculos({
                                                  sedeId,
                                                  from,
                                                  to,
                                                  page,
                                              }: GetElectricidadProps)
    : Promise<electricidadCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            page,
        },
    };
    const {data} = await api.get<electricidadCalculosCollection>("/api/electricidad/calculate", config);
    return data;
}

export async function getElectricidadCalculosReport({
                                                        sedeId,
                                                        from,
                                                        to,
                                                        page,
                                                    }: GetElectricidadProps)
    : Promise<electricidadCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            page,
            all: true
        },
    };
    const {data} = await api.get<electricidadCalculosCollection>(
        "/api/electricidad/calculate", config);
    return data;
}

export async function createCalculosElectricidad({
                                                     sedeId,
                                                     from,
                                                     to,
                                                 }: CreateCalculosElectricidadProps)
    : Promise<AxiosResponse<Response>> {
    const body = {
        sedeId,
        from,
        to,
    };
    return await api.post("/api/electricidad/calculate", body);
}