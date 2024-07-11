import { Sede } from "@prisma/client";
import api from "../../../../config/api";

export async function getSedes(): Promise<Sede[]> {
  const { data } = await api.get<Sede[]>("/api/sede");
  return data;
}
