import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {taxiCalculosCollection} from "@/components/taxi/service/taxiCalculos.interface";

interface Response {
    message: string;
}

interface GetTaxiProps {
    from?: string;
    to?: string;
    page?: number;
    all?: boolean;
}

interface CreateCalculosTaxiProps {
    from?: string;
    to?: string;
}

export async function getTaxiCalculos({
                                          from,
                                          to,
                                          page,
                                      }: GetTaxiProps): Promise<taxiCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            page,
        },
    };
    const {data} = await api.get<taxiCalculosCollection>(
        "/api/taxi/calculate",
        config
    );
    return data;
}

export async function getTaxiCalculosReport({
                                                from,
                                                to,
                                                all = true,
                                            }: GetTaxiProps): Promise<taxiCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            all,
        },
    };
    const {data} = await api.get<taxiCalculosCollection>(
        "/api/taxi/calculate",
        config
    );
    return data;
}

export async function createCalculosTaxi({
                                             from,
                                             to,
                                         }: CreateCalculosTaxiProps): Promise<AxiosResponse<Response>> {
    const body = {
        from,
        to,
    };
    return await api.post("/api/taxi/calculate", body);
}
