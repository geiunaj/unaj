import { Sede } from "@prisma/client";
import api from "../../../../config/api";
import { TipoCombustibleCollection } from "./tipoCombustible.interface";

export async function getTiposCombustible(): Promise<
  TipoCombustibleCollection[]
> {
  const { data } = await api.get<TipoCombustibleCollection[]>(
    "/api/tipoCombustible"
  );
  return data;
}
