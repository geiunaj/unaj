import api from "../../../../config/api";

import {AxiosRequestConfig} from "axios";
import {CollectionConsumoPapel, ConsumoPapelRequest} from "./consumoPapel.interface";

export async function getConsumoPapel(
    sedeId?: number,
    sort?: string,
    direction?: string
): Promise<CollectionConsumoPapel[]> {
    try {
        const config: AxiosRequestConfig = {
            params: {
                sedeId,
                sort,
                direction,
            },
        };
        const {data} = await api.get<CollectionConsumoPapel[]>(
            "/api/consumoPapel",
            config
        );
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los consumos de papel");
    }
}

export async function createConsumoPapel(body: ConsumoPapelRequest) {
    const {data} = await api.post("/api/consumoPapel", body);
    return data;
}
