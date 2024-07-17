import api from "../../../../config/api";
import { tipoPapel } from "./tipoPapel.interface";

export async function getTiposPapel(): Promise<tipoPapel[]> {
  const { data } = await api.get<tipoPapel[]>("/api/tipoPapel");
  return data;
}
