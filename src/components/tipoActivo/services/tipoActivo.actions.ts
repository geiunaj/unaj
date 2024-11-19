import api from "../../../../config/api";
import {
  TipoActivoCollection,
  TipoActivoCollectionPaginate,
  TipoActivoRequest,
  TipoActivoResource,
} from "./tipoActivo.interface";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { GrupoActivo } from "@/components/tipoActivo/services/grupoActivo.interface";
import { CategoriaActivo } from "@/components/tipoActivo/services/categoriaActivo.interface";

interface Response {
  message: string;
}

export async function getTiposActivo(): Promise<TipoActivoCollection[]> {
  const { data } = await api.get<TipoActivoCollection[]>("/api/tipoActivo");
  return data;
}

export async function getTiposActivoPaginate(
  nombre: string = "",
  page: number = 1
): Promise<TipoActivoCollectionPaginate> {
  const config: AxiosRequestConfig = {
    params: {
      nombre,
      perPage: 10,
      page,
    },
  };
  const { data } = await api.get<TipoActivoCollectionPaginate>(
    "/api/tipoActivo",
    config
  );
  return data;
}

export async function getTipoActivoById(
  id: number
): Promise<TipoActivoResource> {
  const { data } = await api.get<TipoActivoResource>(`/api/tipoActivo/${id}`);
  return data;
}

export async function createTipoActivo(
  tipoActivo: TipoActivoRequest
): Promise<AxiosResponse<Response>> {
  return await api.post("/api/tipoActivo", tipoActivo);
}

export async function updateTipoActivo(
  id: number,
  tipoActivo: TipoActivoRequest
): Promise<AxiosResponse<Response>> {
  return await api.put(`/api/tipoActivo/${id}`, tipoActivo);
}

export async function deleteTipoActivo(
  id: number
): Promise<AxiosResponse<Response>> {
  return await api.delete(`/api/tipoActivo/${id}`);
}

export async function getTipoActivoGrupo(): Promise<GrupoActivo[]> {
  const { data } = await api.get<GrupoActivo[]>(`/api/tipoActivo/grupo`);
  return data;
}

export async function getTipoActivoCategoria(): Promise<CategoriaActivo[]> {
  const { data } = await api.get<CategoriaActivo[]>(
    `/api/tipoActivo/categoria`
  );
  return data;
}
