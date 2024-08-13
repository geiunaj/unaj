import api from "../../../../config/api";
import {TipoCombustibleCollection, TipoCombustibleRequest} from "./tipoCombustible.interface";
import {AxiosResponse} from "axios";

interface Response {
    message: string;
}

export async function getTiposCombustible(): Promise<
    TipoCombustibleCollection[]
> {
    const {data} = await api.get<TipoCombustibleCollection[]>(
        "/api/tipoCombustible"
    );
    return data;
}

export async function createTipoCombustible(body: TipoCombustibleRequest): Promise<any> {
    const {data} = await api.post("/api/tipoCombustible", body);
    return data;
}

export async function showTipoCombustible(id: number): Promise<any> {
    const {data} = await api.get(`/api/tipoCombustible/${id}`);
    return data;
}

export async function updateTipoCombustible(id: number, body: TipoCombustibleRequest): Promise<any> {
    const {data} = await api.put(`/api/tipoCombustible/${id}`, body);
    return data;
}

export async function deleteTipoCombustible(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/tipoCombustible/${id}`);
}

