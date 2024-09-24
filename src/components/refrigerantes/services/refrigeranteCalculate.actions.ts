import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {
    RefrigeranteCalculosCollection,
} from "@/components/refrigerantes/services/refrigeranteCalculate.interface";

interface GetRefrigeranteProps {
    sedeId?: number,
    yearFrom?: string,
    yearTo?: string,
    page?: number
}

interface CreateCalculosRefrigeranteProps {
    sedeId?: number;
    yearFrom?: string;
    yearTo?: string;
}

export async function getRefrigeranteCalculate(
    {
        sedeId,
        yearFrom,
        yearTo,
        page,
    }: GetRefrigeranteProps): Promise<RefrigeranteCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            yearFrom,
            yearTo,
            page,
        }
    };
    const {data} = await api.get<RefrigeranteCalculosCollection>("/api/refrigerante/calculate", config);
    return data;
}

export async function getRefrigeranteCalculateReport(
    {
        sedeId,
        yearFrom,
        yearTo,
    }: GetRefrigeranteProps): Promise<RefrigeranteCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            yearFrom,
            yearTo,
            all: true
        }
    };
    const {data} = await api.get("/api/refrigerante/calculate", config);
    return data;
}

export async function createRefrigeranteCalculate(
    {
        sedeId,
        yearFrom,
        yearTo,
    }: CreateCalculosRefrigeranteProps):
    Promise<RefrigeranteCalculosCollection> {

    const body = {
        sedeId,
        from: yearFrom,
        to: yearTo,
    };

    const {data} = await api.post("/api/refrigerante/calculate", body);
    return data;
}
