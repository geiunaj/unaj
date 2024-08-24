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

export async function getElectricidadCalculos(
    sedeId?: number,
    anio?: number,
    page?: number
): Promise<electricidadCalculosCollection> {
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

export async function createCalculosElectricidad(
    sedeId?: number,
    anio?: number,
): Promise<AxiosResponse<Response>> {
    const body = {
        sedeId,
        anio,
    };
    return await api.post("/api/electricidad/calculate", body);
}