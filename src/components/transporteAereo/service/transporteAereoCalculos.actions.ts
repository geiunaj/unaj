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
    sedeId?: number;
    all?: boolean;
}

interface CreateCalculosTransporteAereoProps {
    from?: string;
    to?: string;
    sedeId?: number;
}

export async function getTransporteAereoCalculos({
                                                     from,
                                                     to,
                                                     page,
                                                     sedeId,
                                                 }: GetTransporteAereoProps): Promise<transporteAereoCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            page,
            sedeId,
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
                                                           sedeId,
                                                           all = true,
                                                       }: GetTransporteAereoProps): Promise<transporteAereoCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            sedeId,
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
                                                        sedeId,
                                                    }: CreateCalculosTransporteAereoProps): Promise<AxiosResponse<Response>> {
    const body = {
        from,
        to,
        sedeId,
    };
    return await api.post("/api/transporteAereo/calculate", body);
}
