import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {
    TransporteCasaTrabajoCalculosCollection
} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajoCalculate.interface";

interface GetTransporteCasaTrabajoProps {
    sedeId?: number,
    from?: string,
    to?: string,
    page?: number
}

interface CreateCalculosTransporteCasaTrabajoProps {
    sedeId?: number;
    from?: string;
    to?: string;
}

export async function getTransporteCasaTrabajoCalculate(
    {
        sedeId,
        from,
        to,
        page,
    }: GetTransporteCasaTrabajoProps): Promise<TransporteCasaTrabajoCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            page,
        }
    };
    const {data} = await api.get<TransporteCasaTrabajoCalculosCollection>("/api/transporteCasaTrabajo/calculate", config);
    return data;
}

export async function getTransporteCasaTrabajoCalculateReport(
    {
        sedeId,
        from,
        to,
    }: GetTransporteCasaTrabajoProps): Promise<TransporteCasaTrabajoCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            all: true
        }
    };
    const {data} = await api.get("/api/transporteCasaTrabajo/calculate", config);
    return data;
}

export async function createTransporteCasaTrabajoCalculate(
    {
        sedeId,
        from,
        to,
    }: CreateCalculosTransporteCasaTrabajoProps):
    Promise<TransporteCasaTrabajoCalculosCollection> {

    const body = {
        sedeId,
        from: from,
        to: to,
    };

    const {data} = await api.post("/api/transporteCasaTrabajo/calculate", body);
    return data;
}
