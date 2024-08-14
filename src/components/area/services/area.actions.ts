import {Anio} from "@prisma/client";
import api from "../../../../config/api";
import {Area, AreaRequest} from "@/components/area/services/area.interface";
import {AxiosResponse} from "axios";

interface Response {
    message: string;
}

export async function getArea(): Promise<Area[]> {
    const {data} = await api.get<Area[]>("/api/area");
    return data;
}

export async function getAreaById(id: number): Promise<Area> {
    const {data} = await api.get<Area>(`/api/area/${id}`);
    return data;
}

export async function createArea(area: AreaRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/area", area);
}

export async function updateArea(id: number, area: AreaRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/area/${id}`, area);
}

export async function deleteArea(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/area/${id}`);
}