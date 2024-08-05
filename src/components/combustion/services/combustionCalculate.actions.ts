import api from "../../../../config/api";
import {
    CombustionCalcRequest, CombustionCalcResponse,
} from "@/components/combustion/services/combustionCalculate.interface";
import {AxiosRequestConfig} from "axios";


export async function getCombustionCalculate(sedeId: number, anioId: number, tipo: string): Promise<CombustionCalcResponse[]> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            anioId,
            tipo
        }
    };
    const {data} = await api.get("/api/combustion/calculate", config);
    return data;

}

export async function createCombustionCalculate(body: CombustionCalcRequest): Promise<CombustionCalcResponse[]> {
    const {data} = await api.post("/api/combustion/calculate", body);
    return data;
}
