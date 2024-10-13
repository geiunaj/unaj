import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    transporteAereoCalculosCollection
} from "@/components/transporteAereo/service/transporteAereoCalculos.interface";

interface Response {
    message: string;
}

interface GetTransporteAereoProps {
    from?: string;
    to?: string;
    page?: number;
    all?: boolean;
}

interface CreateCalculosTransporteAereoProps {
    from?: string;
    to?: string;
}

export async function getTransporteAereoCalculos({
                                                     from,
                                                     to,
                                                     page,
                                                 }: GetTransporteAereoProps): Promise<transporteAereoCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            page,
        },
    };
    const {data} = await api.get<transporteAereoCalculosCollection>(
        "/api/transporteAereo/calculate",
        config
    );
    return data;
}

export async function getTransporteAereoCalculosReport({
                                                           from,
                                                           to,
                                                           all = true,
                                                       }: GetTransporteAereoProps): Promise<transporteAereoCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            all,
        },
    };
    const {data} = await api.get<transporteAereoCalculosCollection>(
        "/api/transporteAereo/calculate",
        config
    );
    return data;
}

export async function createCalculosTransporteAereo({
                                                        from,
                                                        to,
                                                    }: CreateCalculosTransporteAereoProps): Promise<AxiosResponse<Response>> {
    const body = {
        from,
        to,
    };
    return await api.post("/api/transporteAereo/calculate", body);
}
