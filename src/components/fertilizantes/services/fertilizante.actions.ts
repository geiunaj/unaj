import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";
import {fertilizanteCollection, FertilizanteRequest, fertilizanteResource} from "./fertilizante.interface";

export async function getFertilizante(
    tipoFertilizanteId?: number,
    claseFertilizante?: string,
    sedeId?: number,
    anio?: string,
    sort?: string,
    direction?: string,
    page?: number,
): Promise<fertilizanteCollection> {
    const config: AxiosRequestConfig = {
        params: {
            sedeId,
            sort,
            direction,
            anio,
            tipoFertilizanteId,
            claseFertilizante,
            page,
        },
    };
    const {data} = await api.get<fertilizanteCollection>(
        "/api/fertilizante",
        config
    );
    return data;
}

export async function getFertilizanteById(id: number): Promise<fertilizanteResource> {
    try {
        const {data} = await api.get(`/api/fertilizante/${id}`);
        return data;
    } catch (error) {
        console.error("Error en getFertilizanteById: ", error);
        throw error;
    }
}

export async function createFertilizante(body: FertilizanteRequest) {
    try {
        const {data} = await api.post("/api/fertilizante", body);
        return data;
    } catch (error) {
        console.error("Error en createFertilizante: ", error);
        return null;
    }
}

export async function updateFertilizante(id: number, body: FertilizanteRequest) {
    try {
        const {data} = await api.put(`/api/fertilizante/${id}`, body);
        return data;
    } catch (error) {
        console.error("Error en updateFertilizante: ", error);
        return null;
    }
}

export async function deleteFertilizante(id: number) {
    const {data} = await api.delete(`/api/fertilizante/${id}`);
    return data;
}
