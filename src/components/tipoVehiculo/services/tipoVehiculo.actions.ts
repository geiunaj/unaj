import api from "../../../../config/api";
import {
    TipoVehiculoCollection,
    TipoVehiculoCollectionPaginate,
    TipoVehiculoRequest,
    TipoVehiculoResource,
} from "./tipoVehiculo.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export async function getTiposVehiculo(): Promise<TipoVehiculoCollection[]> {
    const {data} = await api.get<TipoVehiculoCollection[]>("/api/tipoVehiculo");
    return data;
}

export async function getTiposVehiculoPaginate(
    nombre: string = "",
    page: number = 1
): Promise<TipoVehiculoCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            nombre,
            perPage: 10,
            page,
        },
    };
    const {data} = await api.get<TipoVehiculoCollectionPaginate>(
        "/api/tipoVehiculo",
        config
    );
    return data;
}

export async function getTipoVehiculoById(
    id: number
): Promise<TipoVehiculoResource> {
    const {data} = await api.get<TipoVehiculoResource>(`/api/tipoVehiculo/${id}`);
    return data;
}

export async function createTipoVehiculo(
    tipoVehiculo: TipoVehiculoRequest
): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoVehiculo", tipoVehiculo);
}

export async function updateTipoVehiculo(
    id: number,
    tipoVehiculo: TipoVehiculoRequest
): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoVehiculo/${id}`, tipoVehiculo);
}

export async function deleteTipoVehiculo(
    id: number
): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoVehiculo/${id}`);
}

