import { Anio} from "@prisma/client";
import api from "../../../../config/api";

export async function getAnio(): Promise<Anio[]> {
  const { data } = await api.get<Anio[]>("/api/anio");
  return data;
}
