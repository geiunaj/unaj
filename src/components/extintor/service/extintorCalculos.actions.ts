import api from "../../../../config/api";

import {AxiosRequestConfig, AxiosResponse} from "axios";
import {
    ExtintorCalculosCollection
} from "@/components/extintor/service/extintorCalculos.interface";

interface Response {
    message: string;
}

interface GetExtintorProps {
    from?: string;
    to?: string;
    page?: number;
    all?: boolean;
}

interface CreateCalculosExtintorProps {
    from?: string;
    to?: string;
}

export async function getExtintorCalculos({
                                              from,
                                              to,
                                              page,
                                          }: GetExtintorProps): Promise<ExtintorCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            page,
        },
    };
    const {data} = await api.get<ExtintorCalculosCollection>(
        "/api/extintor/calculate",
        config
    );
    return data;
}

export async function getExtintorCalculosReport({
                                                    from,
                                                    to,
                                                    all = true,
                                                }: GetExtintorProps): Promise<ExtintorCalculosCollection> {
    const config: AxiosRequestConfig = {
        params: {
            from,
            to,
            all,
        },
    };
    const {data} = await api.get<ExtintorCalculosCollection>(
        "/api/extintor/calculate",
        config
    );
    return data;
}

export async function createCalculosExtintor({
                                                 from,
                                                 to,
                                             }: CreateCalculosExtintorProps): Promise<AxiosResponse<Response>> {
    const body = {
        from,
        to,
    };
    return await api.post("/api/extintor/calculate", body);
}
