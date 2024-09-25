import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {ConsumibleCalculosCollection} from "@/components/consumibles/services/consumibleCalculate.interface";

interface GetConsumibleProps {
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    page?: number
}

interface CreateCalculosConsumibleProps {
    sedeId?: number;
    yearFrom?: string;
    yearTo?: string;
}

export async function getConsumibleCalculate(
    {
        sedeId,
        yearFrom,
        yearTo,
        page,
    }: GetConsumibleProps): Promise<ConsumibleCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            yearFrom,
            yearTo,
            page,
        }
    };
    const {data} = await api.get<ConsumibleCalculosCollection>("/api/consumible/calculate", config);
    return data;
}

export async function getConsumibleCalculateReport(
    {
        sedeId,
        yearFrom,
        yearTo,
    }: GetConsumibleProps): Promise<ConsumibleCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            yearFrom,
            yearTo,
            all: true
        }
    };
    const {data} = await api.get("/api/consumible/calculate", config);
    return data;
}

export async function createConsumibleCalculate(
    {
        sedeId,
        yearFrom,
        yearTo,
    }: CreateCalculosConsumibleProps):
    Promise<ConsumibleCalculosCollection> {

    const body = {
        sedeId,
        from: yearFrom,
        to: yearTo,
    };

    const {data} = await api.post("/api/consumible/calculate", body);
    return data;
}
