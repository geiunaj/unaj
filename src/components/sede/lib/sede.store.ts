import { create } from "zustand";
import { Sede } from "../services/sede.interface";
import { getSedes } from "../services/sede.actions";

interface SedeStore {
  sedes: Sede[];
  loadSedes: () => void;
  // createSede: (sede: SedeRequest) => void;
  // showSede: (id: number) => void;
  // updateSede: (id: number, sede: SedeRequest) => void;
  // deleteSede: (id: number) => void;
}

export const useSedeStore = create<SedeStore>((set) => ({
  sedes: [],
  loadSedes: async () => {
    try {
      const data = await getSedes();
      set({ sedes: data });
    } catch (error) {
      console.error("Error loading sedes data:", error);
    }
  },
}));
