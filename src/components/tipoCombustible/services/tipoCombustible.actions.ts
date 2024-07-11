import { Sede } from "@prisma/client";
import api from "../../../../config/api";
import { TipoCombustible } from "./tipoCombustible.interface";

export async function getTiposCombustible(): Promise<TipoCombustible[]> {
  const { data } = await api.get<TipoCombustible[]>("/api/tipoCombustible");
  return data;
}
