import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {consumoPapelCalculosCollection} from "@/components/consumoPapel/services/consumoPapelCalculate.interface";

interface GetConsumoPapelProps {
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    page?: number
}

interface CreateCalculosConsumoPapelProps {
    sedeId?: number;
    yearFrom?: string;
    yearTo?: string;
}

export async function getConsumoPapelCalculate(
    {
        sedeId,
        yearFrom,
        yearTo,
        page,
    }: GetConsumoPapelProps): Promise<consumoPapelCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            yearFrom,
            yearTo,
            page,
        }
    };
    const {data} = await api.get<consumoPapelCalculosCollection>("/api/consumoPapel/calculate", config);
    return data;
}

export async function getConsumoPapelCalculateReport(
    {
        sedeId,
        yearFrom,
        yearTo,
    }: GetConsumoPapelProps): Promise<consumoPapelCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            yearFrom,
            yearTo,
            all: true
        }
    };
    const {data} = await api.get("/api/consumoPapel/calculate", config);
    return data;
}

export async function createConsumoPapelCalculate(
    {
        sedeId,
        yearFrom,
        yearTo,
    }: CreateCalculosConsumoPapelProps):
    Promise<consumoPapelCalculosCollection> {

    const body = {
        sedeId,
        from: yearFrom,
        to: yearTo,
    };

    const {data} = await api.post("/api/consumoPapel/calculate", body);
    return data;
}
