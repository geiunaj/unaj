import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {FactorEmisionVehiculoIndex} from "@/components/tipoVehiculo/lib/tipoVehiculoFactor.hook";
import {
    VehiculoFactorCollectionPaginate, VehiculoFactorRequest
} from "@/components/tipoVehiculo/services/tipoVehiculoFactor.interface";

interface Response {
    message: string;
}


export async function getFactorEmisionVehiculoPage(
    {
        tipoVehiculoId,
        anioId,
        page = 1,
        perPage = 10,
    }: FactorEmisionVehiculoIndex): Promise<VehiculoFactorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            tipoVehiculoId,
            anioId,
            page,
            perPage,
        },
    };
    const {data} = await api.get<VehiculoFactorCollectionPaginate>(
        "/api/tipoVehiculo/factor",
        config
    );
    return data;
}

export async function getFactorEmisionVehiculoById(id: number): Promise<any> {
    const {data} = await api.get(`/api/tipoVehiculo/factor/${id}`);
    return data;
}

export async function createFactorEmisionVehiculo(data: VehiculoFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoVehiculo/factor", data);
}

export async function updateFactorEmisionVehiculo(id: number, data: VehiculoFactorRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoVehiculo/factor/${id}`, data);
}

export async function deleteTipoVehiculoFactor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoVehiculo/factor/${id}`);
}