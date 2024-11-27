import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {Rol, RolById, RolCollection, RolRequest} from "./rol.interface";

interface Response {
    message: string;
}

export async function getRol(): Promise<RolCollection> {
    const {data} = await api.get<RolCollection>("/api/roles");
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
