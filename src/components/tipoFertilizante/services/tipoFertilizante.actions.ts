import {Sede} from "@prisma/client";
import api from "../../../../config/api";
import {ClaseFertilizante, TipoFertilizante} from "./tipoFertilizante.interface";
import {AxiosRequestConfig} from "axios";

export async function getTiposFertilizante(clase?: string): Promise<TipoFertilizante[]> {
    const config: AxiosRequestConfig = {
        params: {
            clase
        },
    };
    const {data} = await api.get<TipoFertilizante[]>("/api/tipoFertilizante", config);
    return data;
}

export async function getClaseFertilizante(): Promise<ClaseFertilizante[]> {
    try {
        const {data} = await api.get<ClaseFertilizante[]>("/api/tipoFertilizante/clase");
        return data;
    } catch (error) {
        console.error("Error en getClaseFertilizante: ", error);
        return [];
    }
}