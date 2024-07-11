import api from "../../../../config/api";
import { AxiosRequestConfig } from "axios";
import { FertilizanteCollection, FertilizanteRequest } from "./fertilizante.interface";

export async function getFertilizante(
  sedeId?: number,
  sort?: string,
  direction?: string
): Promise<FertilizanteCollection[]> {
  const config: AxiosRequestConfig = {
    params: {
      sedeId,
      sort,
      direction,
    },
  };
  const { data } = await api.get<FertilizanteCollection[]>(
    "/api/fertilizante",
    config
  );
  return data;
}

export async function createFertilizante(body: FertilizanteRequest) {
  const { data } = await api.post("/api/fertilizante", body);
  return data;
}
