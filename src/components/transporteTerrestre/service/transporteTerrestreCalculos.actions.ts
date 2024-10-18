import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    transporteTerrestreCalculosCollection
} from "@/components/transporteTerrestre/service/transporteTerrestreCalculos.interface";

interface Response {
    message: string;
}

interface GetTransporteTerrestreProps {
    from?: string;
    to?: string;
    page?: number;
    all?: boolean;
}

interface CreateCalculosTransporteTerrestreProps {
    from?: string;
    to?: string;
}

export async function getTransporteTerrestreCalculos({
                                                         from,
                                                         to,
                                                         page,
                                                     }: GetTransporteTerrestreProps): Promise<transporteTerrestreCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            page,
        },
    };
    const {data} = await api.get<transporteTerrestreCalculosCollection>(
        "/api/transporteTerrestre/calculate",
        config
    );
    return data;
}

export async function getTransporteTerrestreCalculosReport({
                                                               from,
                                                               to,
                                                               all = true,
                                                           }: GetTransporteTerrestreProps): Promise<transporteTerrestreCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            all,
        },
    };
    const {data} = await api.get<transporteTerrestreCalculosCollection>(
        "/api/transporteTerrestre/calculate",
        config
    );
    return data;
}

export async function createCalculosTransporteTerrestre({
                                                            from,
                                                            to,
                                                        }: CreateCalculosTransporteTerrestreProps): Promise<AxiosResponse<Response>> {
    const body = {
        from,
        to,
    };
    return await api.post("/api/transporteTerrestre/calculate", body);
}
