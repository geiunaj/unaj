import api from "../../../../config/api";

import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  TransporteAereoCollection,
  TransporteAereoRequest,
} from "./transporteAereo.interface";

interface Response {
  message: string;
}

export async function getTransporteAereo(
  sedeId?: number,
  from?: string,
  to?: string,
  sort?: string,
  direction?: string,
  page?: number
): Promise<TransporteAereoCollection> {
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
  const { data } = await api.get<TransporteAereoCollection>(
    "/api/transporteAereo",
    config
  );
  return data;
}

export async function getTransporteAereoReport(
  sedeId?: number,
  from?: string,
  to?: string,
  sort?: string,
  direction?: string
): Promise<TransporteAereoCollection> {
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
  const { data } = await api.get<TransporteAereoCollection>(
    "/api/transporteAereo",
    config
  );
  return data;
}

export async function getTransporteAereoById(id: number) {
  const { data } = await api.get(`/api/transporteAereo/${id}`);
  return data;
}

export async function createTransporteAereo(
  body: TransporteAereoRequest
): Promise<AxiosResponse<Response>> {
  return await api.post("/api/transporteAereo", body);
}

export async function updateTransporteAereo(
  id: number,
  body: TransporteAereoRequest
): Promise<AxiosResponse<Response>> {
  return await api.put(`/api/transporteAereo/${id}`, body);
}

export async function deleteTransporteAereo(
  id: number
): Promise<AxiosResponse<Response>> {
  return await api.delete(`/api/transporteAereo/${id}`);
}
