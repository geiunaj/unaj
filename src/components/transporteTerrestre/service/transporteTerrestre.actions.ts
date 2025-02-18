import api from "../../../../config/api";

import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  TransporteTerrestreCollection,
  TransporteTerrestreRequest,
  TransporteTerrestreResource,
} from "./transporteTerrestre.interface";

interface Response {
  message: string;
}

export async function getTransporteTerrestre(
  sedeId?: number,
  from?: string,
  to?: string,
  sort?: string,
  direction?: string,
  page?: number
): Promise<TransporteTerrestreCollection> {
  const config: AxiosRequestConfig = {
    params: {
      sedeId,
      from,
      to,
      sort,
      direction,
      page,
    },
  };
  const { data } = await api.get<TransporteTerrestreCollection>(
    "/api/transporteTerrestre",
    config
  );
  return data;
}

export async function getTransporteTerrestreReport(
  sedeId?: number,
  from?: string,
  to?: string,
  sort?: string,
  direction?: string
): Promise<TransporteTerrestreCollection> {
  const config: AxiosRequestConfig = {
    params: {
      sedeId,
      from,
      to,
      sort,
      direction,
      all: true,
    },
  };
  const { data } = await api.get<TransporteTerrestreCollection>(
    "/api/transporteTerrestre",
    config
  );
  return data;
}

export async function getTransporteTerrestreById(
  id: number
): Promise<TransporteTerrestreResource> {
  const { data } = await api.get(`/api/transporteTerrestre/${id}`);
  return data;
}

export async function createTransporteTerrestre(
  body: TransporteTerrestreRequest
): Promise<AxiosResponse<Response>> {
  return await api.post("/api/transporteTerrestre", body);
}

export async function updateTransporteTerrestre(
  id: number,
  body: TransporteTerrestreRequest
): Promise<AxiosResponse<Response>> {
  return await api.put(`/api/transporteTerrestre/${id}`, body);
}

export async function deleteTransporteTerrestre(
  id: number
): Promise<AxiosResponse<Response>> {
  return await api.delete(`/api/transporteTerrestre/${id}`);
}
