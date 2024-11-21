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
    tipoVehiculoId?: number,
    tipo?: string,
    sedeId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
    page?: number,
): Promise<TransporteCasaTrabajoCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoVehiculoId,
            tipo,
            sedeId,
            from,
            to,
            sort,
            direction,
            page,
        },
    };
    const {data} = await api.get<TransporteCasaTrabajoCollection>(
        "/api/transporteCasaTrabajo",
        config
    );
    return data;
}

export async function getTransporteCasaTrabajoReport(
    tipoVehiculoId?: number,
    tipo?: string,
    claseTransporteCasaTrabajo?: string,
    sedeId?: number,
    from?: string,
    to?: string,
    sort?: string,
    direction?: string,
): Promise<TransporteCasaTrabajoCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipoVehiculoId,
            tipo,
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
        "/api/transporteCasaTrabajo",
        config
    );
    return data;
}

export async function getTransporteCasaTrabajoById(id: number): Promise<TransporteCasaTrabajoResource> {
    const {data} = await api.get(`/api/transporteCasaTrabajo/${id}`);
    return data;
}

export async function createTransporteCasaTrabajo(body: TransporteCasaTrabajoRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/transporteCasaTrabajo", body);
}

export async function updateTransporteCasaTrabajo(id: number, body: TransporteCasaTrabajoRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/transporteCasaTrabajo/${id}`, body);
}

export async function deleteTransporteCasaTrabajo(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/transporteCasaTrabajo/${id}`);
}
