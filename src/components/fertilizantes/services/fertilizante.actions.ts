import api from "../../../../config/api";
import { AxiosRequestConfig } from "axios";
import { fertilizanteCollection, FertilizanteRequest } from "./fertilizante.interface";

export async function getFertilizante(
  sedeId?: number,
  sort?: string,
  direction?: string,
  anioId?: number,
  tipoFertilizanteId?: number,
  claseFertilizante?: string,
): Promise<fertilizanteCollection[]> {
  const config: AxiosRequestConfig = {
    params: {
      sedeId,
      sort,
      direction,
      anioId,
      tipoFertilizanteId,
      claseFertilizante,
    },
  };
  const { data } = await api.get<fertilizanteCollection[]>(
    "/api/fertilizante",
    config
  );
  return data;
}

export async function getFertilizanteById(id: number) {
  const {data} = await api.get(`/api/fertilizante/${id}`);
  return data;
}

export async function createFertilizante(body: FertilizanteRequest) {
  const { data } = await api.post("/api/fertilizante", body);
  return data;
}

export async function updateFertilizante(id: number, body: FertilizanteRequest) {
  const {data} = await api.put(`/api/fertilizante/${id}`, body);
  return data;
}

export async function deleteFertilizante(id: number) {
  const {data} = await api.delete(`/api/fertilizante/${id}`);
  return data;
}
