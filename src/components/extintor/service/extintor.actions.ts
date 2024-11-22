import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {ExtintorCollection, ExtintorRequest} from "./extintor.interface";

interface Response {
    message: string;
}

export async function getExtintor(
    sedeId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
    page?: number,
): Promise<ExtintorCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            sort,
            direction,
            page,
        },
    };
    const {data} = await api.get<ExtintorCollection>("/api/extintor", config);
    return data;
}

export async function getExtintorReport(
    sedeId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
): Promise<ExtintorCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            sort,
            direction,
            all: true
        },
    };
    const {data} = await api.get<ExtintorCollection>("/api/extintor", config);
    return data;
}

export async function getExtintorById(id: number) {
    const {data} = await api.get(`/api/extintor/${id}`);
    return data;
}

export async function createExtintor(
    body: ExtintorRequest
): Promise<AxiosResponse<Response>> {
    return await api.post("/api/extintor", body);
}

export async function updateExtintor(
    id: number,
    body: ExtintorRequest
): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/extintor/${id}`, body);
}

export async function deleteExtintor(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/extintor/${id}`);
}
