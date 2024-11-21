import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    TransporteCasaTrabajoCollection,
    TransporteCasaTrabajoRequest,
    TransporteCasaTrabajoResource
} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajo.interface";

interface Response {
    message: string;
}

export async function getTransporteCasaTrabajo(
    tipoTransporteCasaTrabajoId?: number,
    sedeId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
    page?: number,
): Promise<TransporteCasaTrabajoCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoTransporteCasaTrabajoId,
            sedeId,
            from,
            to,
            sort,
            direction,
            page,
        },
    };
    const {data} = await api.get<TransporteCasaTrabajoCollection>(
        "/api/activo",
        config
    );
    return data;
}

export async function getTransporteCasaTrabajoReport(
    tipoTransporteCasaTrabajoId?: number,
    claseTransporteCasaTrabajo?: string,
    sedeId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
): Promise<TransporteCasaTrabajoCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoTransporteCasaTrabajoId,
            claseTransporteCasaTrabajo,
            sedeId,
            from,
            to,
            sort,
            direction,
            all: true,
        },
    };
    const {data} = await api.get<TransporteCasaTrabajoCollection>(
        "/api/activo",
        config
    );
    return data;
}

export async function getTransporteCasaTrabajoById(id: number): Promise<TransporteCasaTrabajoResource> {
    const {data} = await api.get(`/api/activo/${id}`);
    return data;
}

export async function createTransporteCasaTrabajo(body: TransporteCasaTrabajoRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/activo", body);
}

export async function updateTransporteCasaTrabajo(id: number, body: TransporteCasaTrabajoRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/activo/${id}`, body);
}

export async function deleteTransporteCasaTrabajo(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/activo/${id}`);
}
