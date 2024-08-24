import api from "../../../../config/api";
import {AxiosResponse} from "axios";
import { GPWCollection, GPWRequest } from "./gwp.interface";

interface Response {
    message: string;
}

export async function getGPW(): Promise<
    GPWCollection[]
> {
    const {data} = await api.get<GPWCollection[]>(
        "/api/gpw"
    );
    return data;
}

export async function createGPW(body: GPWRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/gpw", body);
}

export async function showGPW(id: number): Promise<any> {
    const {data} = await api.get(`/api/gpw/${id}`);
    return data;
}

export async function updateGPW(id: number, body: GPWRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/gpw/${id}`, body);
}

export async function deleteGPW(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/gpw/${id}`);
}

