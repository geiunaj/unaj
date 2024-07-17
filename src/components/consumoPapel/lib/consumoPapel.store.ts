import { create } from "zustand";
import { CollectionConsumoPapel, ConsumoPapelRequest } from "../services/consumoPapel.interface";
import { createConsumoPapel, getConsumoPapel } from "../services/consumoPapel.actions";


type sort =
  | "id"
  | "tipoPapel_id"
  | "cantidad"
  | "comentario"
  | "mes_id"
  | "anio_id"
  | "sede_id";
type direction = "asc" | "desc";

interface ConsumoPapelStore {
  consumoPapel: CollectionConsumoPapel[];
  loadConsumoPapel: (options?: {
    sedeId?: number;
    sort?: sort;
    direction?: direction;
  }) => void;
  createConsumoPapel: (consumoPapel: ConsumoPapelRequest) => void;
  // showCombustion: (id: number) => void;
  // updateCombustion: (id: number, combustion: CombustionRequest) => void;
  // deleteCombustion: (id: number) => void;
}

export const useConsumoPapelStore = create<ConsumoPapelStore>((set) => ({
    consumoPapel: [],
    loadConsumoPapel: async ({
    sedeId,
    sort,
    direction,
  }: {
    sedeId?: number;
    sort?: sort;
    direction?: direction;
  } = {}) => {
    try {
      const data = await getConsumoPapel(sedeId, sort, direction);
      set({ consumoPapel: data });
    } catch (error) {
      console.error("Error loading combustion data:", error);
    }
  },
  createConsumoPapel: async (consumoPapel: ConsumoPapelRequest) => {
    try {
      const data = await createConsumoPapel(consumoPapel);
      console.log("Combustion created:", data);
    } catch (error) {
      console.error("Error creating combustion:", error);
    }
  },
}));
