import { Sede } from "@prisma/client";
import api from "../../../../config/api";
import { ClaseFertilizante, TipoFertilizante } from "./tipoFertilizante.interface";

export async function getTiposFertilizante(): Promise<TipoFertilizante[]> {
  const { data } = await api.get<TipoFertilizante[]>("/api/tipoFertilizante");
  return data;
}

export async function getClaseFertilizante(): Promise<ClaseFertilizante[]> {
  const { data } = await api.get<ClaseFertilizante[]>("/api/tipoFertilizante/clase");
  return data;
}