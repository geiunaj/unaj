import { create } from "zustand";
import {
  CombustionRequest,
  CombustionCollection,
} from "../services/combustion.interface";
import {
  createCombustion,
  getCombustion,
} from "../services/combustion.actions";

type tipoForm = "estacionario" | "movil";
type sort =
  | "id"
  | "tipo"
  | "tipoEquipo"
  | "consumo"
  | "tipoCombustible_id"
  | "mes_id"
  | "anio_id"
  | "sede_id";
type direction = "asc" | "desc";

interface CombustionStore {
  combustion: CombustionCollection[];
  loadCombustion: (options?: {
    tipo?: tipoForm;
    sedeId?: number;
    sort?: sort;
    direction?: direction;
  }) => void;
  createCombustion: (combustion: CombustionRequest) => void;
  // showCombustion: (id: number) => void;
  // updateCombustion: (id: number, combustion: CombustionRequest) => void;
  // deleteCombustion: (id: number) => void;
}

export const useCombustionStore = create<CombustionStore>((set) => ({
  combustion: [],
  loadCombustion: async ({
    tipo,
    sedeId,
    sort,
    direction,
  }: {
    tipo?: tipoForm;
    sedeId?: number;
    sort?: sort;
    direction?: direction;
  } = {}) => {
    try {
      const data = await getCombustion(tipo, sedeId, sort, direction);
      set({ combustion: data });
    } catch (error) {
      console.error("Error loading combustion data:", error);
    }
  },
  createCombustion: async (combustion: CombustionRequest) => {
    try {
      const data = await createCombustion(combustion);
      console.log("Combustion created:", data);
    } catch (error) {
      console.error("Error creating combustion:", error);
    }
  },
}));
