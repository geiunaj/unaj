import api from "../../../../config/api";
import {
    CombustionCalcResponse,
    combustionCalculosCollection,
} from "@/components/combustion/services/combustionCalculate.interface";
import {AxiosRequestConfig} from "axios";

interface GetCombustionProps {
    tipo: string,
    sedeId?: number,
    from?: string,
    to?: string,
    page?: number
}

interface CreateCalculosCombustionProps {
    tipo: string;
    sedeId?: number;
    from?: string;
    to?: string;
}

export async function getCombustionCalculate({
                                                 tipo,
                                                 sedeId,
                                                 from,
                                                 to,
                                                 page,
                                             }: GetCombustionProps): Promise<combustionCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipo,
            sedeId,
            from,
            to,
            page,
        }
    };
    const {data} = await api.get<combustionCalculosCollection>("/api/combustion/calculate", config);
    return data;
}

export async function getCombustionCalculateReport({
                                                       tipo,
                                                       sedeId,
                                                       from,
                                                       to,
                                                   }: GetCombustionProps): Promise<combustionCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            tipo,
            sedeId,
            from,
            to,
            all: true
        }
    };
    const {data} = await api.get("/api/combustion/calculate", config);
    return data;
}

export async function createCombustionCalculate({
                                                    tipo,
                                                    sedeId,
                                                    from,
                                                    to
                                                }: CreateCalculosCombustionProps):
    Promise<CombustionCalcResponse[]> {

    const body = {
        tipo,
        sedeId,
        from,
        to,
    };

    const {data} = await api.post("/api/combustion/calculate", body);
    return data;
}
