import {SummaryItem} from "@/components/resumen/service/resumen.interface";
import {AxiosRequestConfig} from "axios";
import api from "../../../../config/api";

export async function getSummary(
    sedeId?: number,
    from?: string,
    to?: string,
): Promise<SummaryItem[]> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            from,
            to,
        },
    };
    const {data} = await api.get<SummaryItem[]>("/api/resumen", config);
    return data;
}