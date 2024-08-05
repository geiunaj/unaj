import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {
    FertilizanteCalcRequest,
    FertilizanteCalcResponse,
} from "./fertilizanteCalculate.interface";

export async function getFertilizanteCalculate(
    sedeId: number,
    anioId: number
): Promise<FertilizanteCalcResponse[]> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            anioId,
        },
    };
    const {data} = await api.get("/api/fertilizante/calculate", config);
    return data;
}

export async function createFertilizanteCalculate(
    body: FertilizanteCalcRequest
): Promise<FertilizanteCalcResponse[]> {
    const {data} = await api.post("/api/fertilizante/calculate", body);
    return data;
}
