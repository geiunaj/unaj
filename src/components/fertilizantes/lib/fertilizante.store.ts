import { create } from "zustand";
import {
  fertilizanteCollection,
  FertilizanteRequest,
} from "../services/fertilizante.interface";
import {
  createFertilizante,
  getFertilizante,
} from "../services/fertilizante.actions";

type sort =
  | "id"
  | "tipoFertilizante"
  | "nombreFertilizante"
  | "cantidadFertilizante"
  | "porcentajeN"
  | "ficha"
  | "sede_id";
type direction = "asc" | "desc";

interface FertilizanteStore {
  fertilizante: fertilizanteCollection[];
  loadFertilizante: (options?: {
    sedeId?: number;
    sort?: sort;
    direction?: direction;
  }) => void;
  createFertilizante: (fertilizante: FertilizanteRequest) => void;
}

export const useFertilizanteStore = create<FertilizanteStore>((set) => ({
  fertilizante: [],
  loadFertilizante: async ({
    sedeId,
    sort,
    direction,
  }: {
    sedeId?: number;
    sort?: sort;
    direction?: direction;
  } = {}) => {
    try {
      const data = await getFertilizante(sedeId, sort, direction);
      set({ fertilizante: data });
    } catch (error) {
      console.error("Error loading fertilizante data", error);
    }
  },
  createFertilizante: async (fertilizante: FertilizanteRequest) => {
    try {
      const data = await createFertilizante(fertilizante);
    } catch (error) {
      console.error("Error creating fertilizante", error);
    }
  },
}));
