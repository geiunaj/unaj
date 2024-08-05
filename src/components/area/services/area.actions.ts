import {Anio} from "@prisma/client";
import api from "../../../../config/api";
import {Area} from "@/components/area/services/area.interface";

export async function getArea(): Promise<Area[]> {
    const {data} = await api.get<Anio[]>("/api/area");
    return data;
}
