import api from "../../../../config/api";

import { AxiosRequestConfig } from "axios";
import { CollectionConsumoPapel, ConsumoPapelRequest } from "./consumoPapel.interface";

export async function getConsumoPapel(
  sedeId?: number,
  sort?: string,
  direction?: string
): Promise<CollectionConsumoPapel[]> {
  const config: AxiosRequestConfig = {
    params: {
      sedeId,
      sort,
      direction,
    },
  };
  const { data } = await api.get<CollectionConsumoPapel[]>(
    "/api/consumoPapel",
    config
  );
  return data;
}

export async function createConsumoPapel(body: ConsumoPapelRequest) {
  const { data } = await api.post("/api/consumoPapel", body);
  return data;
}
