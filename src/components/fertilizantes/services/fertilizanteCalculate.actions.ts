import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {fertilizanteCalculosCollection} from "@/components/fertilizantes/services/fertilizanteCalculate.interface";

interface GetFertilizanteProps {
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    page?: number
}

interface CreateCalculosFertilizanteProps {
    sedeId?: number;
    yearFrom?: string;
    yearTo?: string;
}

export async function getFertilizanteCalculate(
    {
        sedeId,
        yearFrom,
        yearTo,
        page,
    }: GetFertilizanteProps): Promise<fertilizanteCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            yearFrom,
            yearTo,
            page,
        }
    };
    const {data} = await api.get<fertilizanteCalculosCollection>("/api/fertilizante/calculate", config);
    return data;
}

export async function getFertilizanteCalculateReport(
    {
        sedeId,
        yearFrom,
        yearTo,
    }: GetFertilizanteProps): Promise<fertilizanteCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            yearFrom,
            yearTo,
            all: true
        }
    };
    const {data} = await api.get("/api/fertilizante/calculate", config);
    return data;
}

export async function createFertilizanteCalculate(
    {
        sedeId,
        yearFrom,
        yearTo,
    }: CreateCalculosFertilizanteProps):
    Promise<fertilizanteCalculosCollection> {

    const body = {
        sedeId,
        from: yearFrom,
        to: yearTo,
    };

    const {data} = await api.post("/api/fertilizante/calculate", body);
    return data;
}
