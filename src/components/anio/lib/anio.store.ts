import { create } from "zustand";
import { Anio } from "@prisma/client";
import { getAnio } from "../services/anio.actions";

interface AnioStore {
  anios: Anio[];
  loadAnios: () => void;

}

export const useAnioStore = create<AnioStore>((set) => ({
  anios: [],
  loadAnios: async () => {
    try {
      const data = await getAnio();
      set({ anios: data });
    } catch (error) {
      console.error("Error loading años data:", error);
    }
  },
}));
