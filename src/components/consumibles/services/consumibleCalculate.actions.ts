import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {ConsumibleCalculosCollection} from "@/components/consumibles/services/consumibleCalculate.interface";

interface GetConsumibleProps {
    sedeId?: number,
    from?: string,
    to?: string,
    page?: number
}

interface CreateCalculosConsumibleProps {
    sedeId?: number;
    from?: string;
    to?: string;
}

export async function getConsumibleCalculate(
    {
        sedeId,
        from,
        to,
        page,
    }: GetConsumibleProps): Promise<ConsumibleCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            page,
        }
    };
    const {data} = await api.get<ConsumibleCalculosCollection>("/api/consumible/calculate", config);
    return data;
}

export async function getConsumibleCalculateReport(
    {
        sedeId,
        from,
        to,
    }: GetConsumibleProps): Promise<ConsumibleCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            all: true
        }
    };
    const {data} = await api.get("/api/consumible/calculate", config);
    return data;
}

export async function createConsumibleCalculate(
    {
        sedeId,
        from,
        to,
    }: CreateCalculosConsumibleProps):
    Promise<ConsumibleCalculosCollection> {

    const body = {
        sedeId,
        from: from,
        to: to,
    };

    const {data} = await api.post("/api/consumible/calculate", body);
    return data;
}
