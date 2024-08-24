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
    anio?: number,
    page?: number
}

interface CreateCalculosElectricidadProps {
    sedeId?: number;
    anio?: number;
}

export async function getElectricidadCalculos({
                                                  sedeId,
                                                  anio,
                                                  page,
                                              }: GetElectricidadProps)
    : Promise<electricidadCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            anio,
            page,
        },
    };
    const {data} = await api.get<electricidadCalculosCollection>(
        "/api/electricidad/calculate", config);
    return data;
}

export async function createCalculosElectricidad({
                                                     sedeId,
                                                     anio,
                                                 }: CreateCalculosElectricidadProps)
    : Promise<AxiosResponse<Response>> {
    const body = {
        sedeId,
        anio,
    };
    return await api.post("/api/electricidad/calculate", body);
}