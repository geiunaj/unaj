import api from "../../../../config/api";
import { Mes } from "./mes.interface";

export async function getMes(): Promise<Mes[]> {
  const { data } = await api.get<Mes[]>("/api/mes");
  return data;
}
