import api from "../../../../config/api";
import {
    CombustionCalcRequest, CombustionCalcResponse,
} from "@/components/combustion/services/combustionCalculate.interface";
import {AxiosRequestConfig} from "axios";


export async function getCombustionCalculate(sedeId: number, anioId: number): Promise<CombustionCalcResponse[]> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            anioId
        }
    };
    const {data} = await api.get("/api/calculateCombustion", config);
    return data;

}

export async function createCombustionCalculate(body: CombustionCalcRequest): Promise<CombustionCalcResponse[]> {
    const {data} = await api.post("/api/calculateCombustion", body);
    return data;
}
