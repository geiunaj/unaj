import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {
    ActivoCalculosCollection
} from "@/components/activos/services/activosCalculate.interface";

interface GetActivoProps {
    sedeId?: number,
    from?: string,
    to?: string,
    page?: number
}

interface CreateCalculosActivoProps {
    sedeId?: number;
    from?: string;
    to?: string;
}

export async function getActivoCalculate(
    {
        sedeId,
        from,
        to,
        page,
    }: GetActivoProps): Promise<ActivoCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            page,
        }
    };
    const {data} = await api.get<ActivoCalculosCollection>("/api/activo/calculate", config);
    return data;
}

export async function getActivoCalculateReport(
    {
        sedeId,
        from,
        to,
    }: GetActivoProps): Promise<ActivoCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            all: true
        }
    };
    const {data} = await api.get("/api/activo/calculate", config);
    return data;
}

export async function createActivoCalculate(
    {
        sedeId,
        from,
        to,
    }: CreateCalculosActivoProps):
    Promise<ActivoCalculosCollection> {

    const body = {
        sedeId,
        from: from,
        to: to,
    };

    const {data} = await api.post("/api/activo/calculate", body);
    return data;
}
