import api from "../../../../config/api";
import {Anio, AnioCollection, AnioRequest} from "@/components/anio/services/anio.interface";
import {AxiosResponse} from "axios";
import {TipoExtintor} from "@/components/tipoExtintor/services/tipoExtintor.interface";

export async function getAnio(): Promise<Anio[]> {
    try {
        const {data} = await api.get<Anio[]>("/api/anio");
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los años");
    }
}

export async function getTipoExtintor(): Promise<TipoExtintor[]> {
    const {data} = await api.get<TipoExtintor[]>("/api/tipoExtintor");
    return data;
}

export async function getAnioPaginate(page: number, perPage: number): Promise<AnioCollection> {
    try {
        const params = {
            page,
            perPage
        }
        const {data} = await api.get<AnioCollection>("/api/anio", {params});
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los años");
    }
}

export async function getAnioById(id: number): Promise<Anio> {
    const {data} = await api.get<Anio>(`/api/anio/${id}`);
    return data;
}

export async function createAnio(anio: AnioRequest): Promise<AxiosResponse<ResponseI>> {
    return await api.post("/api/anio", anio);
}

export async function updateAnio(id: number, anio: AnioRequest): Promise<AxiosResponse<ResponseI>> {
    return await api.put(`/api/anio/${id}`, anio);
}

export async function deleteAnio(id: number): Promise<AxiosResponse<ResponseI>> {
    return await api.delete(`/api/anio/${id}`);
}

interface ResponseI {
    message: string;
}