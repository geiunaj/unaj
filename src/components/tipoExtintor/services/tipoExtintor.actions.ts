import api from "../../../../config/api";
import {
    TipoExtintorCollection,
    TipoExtintorCollectionPaginate,
    TipoExtintorRequest,
    TipoExtintorResource,
} from "./tipoExtintor.interface";
import {AxiosRequestConfig, AxiosResponse} from "axios";

interface Response {
    message: string;
}

export async function getTiposExtintor(): Promise<TipoExtintorCollection[]> {
    const {data} = await api.get<TipoExtintorCollection[]>("/api/tipoExtintor");
    return data;
}

export async function getTiposExtintorPaginate(
    nombre: string = "",
    page: number = 1
): Promise<TipoExtintorCollectionPaginate> {
    const config: AxiosRequestConfig = {
        params: {
            nombre,
            perPage: 10,
            page,
        },
    };
    const {data} = await api.get<TipoExtintorCollectionPaginate>(
        "/api/tipoExtintor",
        config
    );
    return data;
}

export async function getTipoExtintorById(
    id: number
): Promise<TipoExtintorResource> {
    const {data} = await api.get<TipoExtintorResource>(`/api/tipoExtintor/${id}`);
    return data;
}

export async function createTipoExtintor(
    tipoExtintor: TipoExtintorRequest
): Promise<AxiosResponse<Response>> {
    return await api.post("/api/tipoExtintor", tipoExtintor);
}

export async function updateTipoExtintor(
    id: number,
    tipoExtintor: TipoExtintorRequest
): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/tipoExtintor/${id}`, tipoExtintor);
}

export async function deleteTipoExtintor(
    id: number
): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoExtintor/${id}`);
}

