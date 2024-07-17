import { create } from "zustand";
import { Mes } from "../services/mes.interface";
import { getMes } from "../services/mes.actions";

interface MesStore {
  meses: Mes[];
  loadMeses: () => void;
}

export const useMesStore = create<MesStore>((set) => ({
  meses: [],
  loadMeses: async () => {
    try {
      const data = await getMes();
      set({ meses: data });
    } catch (error) {
      console.error("Error loading meses data:", error);
    }
  },
}));
