import { Sede } from "@prisma/client";
import api from "../../../../config/api";
import { TipoFertilizante } from "./tipoFertilizante.interface";

export async function getTiposFertilizante(): Promise<TipoFertilizante[]> {
  const { data } = await api.get<TipoFertilizante[]>("/api/tipoFertilizante");
  return data;
}
