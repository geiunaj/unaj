import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {ActivoCollection, ActivoRequest, ActivoResource} from "@/components/activos/services/activos.interface";

interface Response {
    message: string;
}

export async function getActivo(
    tipoActivoId?: number,
    sedeId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
    page?: number,
): Promise<ActivoCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoActivoId,
            sedeId,
            from,
            to,
            sort,
            direction,
            page,
        },
    };
    const {data} = await api.get<ActivoCollection>(
        "/api/consumible",
        config
    );
    return data;
}

export async function getActivoReport(
    tipoActivoId?: number,
    claseActivo?: string,
    sedeId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
): Promise<ActivoCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoActivoId,
            claseActivo,
            sedeId,
            from,
            to,
            sort,
            direction,
            all: true,
        },
    };
    const {data} = await api.get<ActivoCollection>(
        "/api/consumible",
        config
    );
    return data;
}

export async function getActivoById(id: number): Promise<ActivoResource> {
    const {data} = await api.get(`/api/consumible/${id}`);
    return data;
}

export async function createActivo(body: ActivoRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/consumible", body);
}

export async function updateActivo(id: number, body: ActivoRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/consumible/${id}`, body);
}

export async function deleteActivo(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/consumible/${id}`);
}
