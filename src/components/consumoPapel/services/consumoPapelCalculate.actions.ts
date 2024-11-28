import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {consumoPapelCalculosCollection} from "@/components/consumoPapel/services/consumoPapelCalculate.interface";

interface GetConsumoPapelProps {
    sedeId?: number,
    from?: string,
    to?: string,
    page?: number
}

interface CreateCalculosConsumoPapelProps {
    sedeId?: number;
    from?: string;
    to?: string;
}

export async function getConsumoPapelCalculate(
    {
        sedeId,
        from,
        to,
        page,
    }: GetConsumoPapelProps): Promise<consumoPapelCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            page,
        }
    };
    const {data} = await api.get<consumoPapelCalculosCollection>("/api/consumoPapel/calculate", config);
    return data;
}

export async function getConsumoPapelCalculateReport(
    {
        sedeId,
        from,
        to,
    }: GetConsumoPapelProps): Promise<consumoPapelCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
            all: true
        }
    };
    const {data} = await api.get("/api/consumoPapel/calculate", config);
    return data;
}

export async function createConsumoPapelCalculate(
    {
        sedeId,
        from,
        to,
    }: CreateCalculosConsumoPapelProps):
    Promise<consumoPapelCalculosCollection> {

    const body = {
        sedeId,
        from: from,
        to: to,
    };

    const {data} = await api.post("/api/consumoPapel/calculate", body);
    return data;
}
