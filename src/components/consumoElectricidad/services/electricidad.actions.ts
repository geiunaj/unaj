import api from "../../../../config/api";

import { AxiosRequestConfig } from "axios";
import {
  electricidadCollection,
  electricidadRequest,
} from "./electricidad.interface";

export async function getElectricidad(
  sedeId?: number,
  mesId?: number,
  sort?: string ,
  direction?: string,
  anioId?: number
): Promise<electricidadCollection[]> {
  const config: AxiosRequestConfig = {
    params: {
      sedeId,
      sort,
      direction,
      anioId,
      mesId,
    },
  };
  const { data } = await api.get<electricidadCollection[]>(
    "/api/electricidad",
    config
  );
  return data;
}

export async function getElectricidadById(id: number) {
  const { data } = await api.get(`/api/electricidad/${id}`);
  return data;
}

export async function createElectricidad(body: electricidadRequest) {
  const { data } = await api.post("/api/electricidad", body);
  return data;
}

export async function updateElectricidad(
  id: number,
  body: electricidadRequest
) {
  const { data } = await api.put(`/api/electricidad/${id}`, body);
  return data;
}

export async function deleteElectricidad(id: number) {
  const { data } = await api.delete(`/api/electricidad/${id}`);
  return data;
}
