import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {Rol, RolById, RolCollection, RolCollectionItem, RolRequest} from "./rol.interface";

interface Response {
    message: string;
}

export interface getRolIndex {
    perPage: number;
    page: number;
}

export async function getRolPaginate({perPage, page}: getRolIndex): Promise<RolCollection> {
    const config: AxiosRequestConfig = {
        params: {perPage, page}
    };
    const {data} = await api.get<RolCollection>("/api/roles", config);
    return data;
}

export async function getRol(): Promise<RolCollectionItem[]> {
    const {data} = await api.get<RolCollectionItem[]>("/api/roles");
    return data;
}

export async function getRolById(id: number): Promise<RolById> {
    const {data} = await api.get<RolById>(`/api/roles/${id}`);
    return data;
}

export async function createRol(
    Rol: RolRequest
): Promise<AxiosResponse<Response>> {
    return await api.post("/api/roles", Rol);
}

export async function updateRol(
    id: number,
    Rol: RolRequest
): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/roles/${id}`, Rol);
}

export async function deleteRol(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/roles/${id}`);
}
