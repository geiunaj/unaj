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

interface CombustionStore {
  consumoPapel: CollectionConsumoPapel[];
  loadConsumoPapel: (options?: {
    sedeId?: number;
    sort?: sort;
    direction?: direction;
  }) => void;
  createCombustion: (consumoPapel: ConsumoPapelRequest) => void;
  // showCombustion: (id: number) => void;
  // updateCombustion: (id: number, combustion: CombustionRequest) => void;
  // deleteCombustion: (id: number) => void;
}

export const useCombustionStore = create<CombustionStore>((set) => ({
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
  createCombustion: async (consumoPapel: ConsumoPapelRequest) => {
    try {
      const data = await createConsumoPapel(consumoPapel);
      console.log("Combustion created:", data);
    } catch (error) {
      console.error("Error creating combustion:", error);
    }
  },
}));
