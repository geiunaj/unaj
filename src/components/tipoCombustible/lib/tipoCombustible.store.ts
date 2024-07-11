import { create } from "zustand";
import { TipoCombustible } from "../services/tipoCombustible.interface";
import { getTiposCombustible } from "../services/tipoCombustible.actions";

interface TipoCombustibleStore {
  tiposCombustible: TipoCombustible[];
  loadTiposCombustible: () => void;
  // createTipoCombustible: (sede: TipoCombustibleRequest) => void;
  // showTipoCombustible: (id: number) => void;
  // updateTipoCombustible: (id: number, sede: TipoCombustibleRequest) => void;
  // deleteTipoCombustible: (id: number) => void;
}

export const useTipoCombustibleStore = create<TipoCombustibleStore>((set) => ({
  tiposCombustible: [],
  loadTiposCombustible: async () => {
    try {
      const data = await getTiposCombustible();
      set({ tiposCombustible: data });
    } catch (error) {
      console.error("Error loading tipos de combustible data:", error);
    }
  },
}));
