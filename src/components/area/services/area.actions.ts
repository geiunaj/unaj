import {Anio} from "@prisma/client";
import api from "../../../../config/api";
import {Area} from "@/components/area/services/area.interface";


export async function getArea(): Promise<Area[]> {
    try {
        const {data} = await api.get<Area[]>("/api/area");
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener las areas");
    }
}
