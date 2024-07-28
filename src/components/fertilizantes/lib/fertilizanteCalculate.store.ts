import { create } from "zustand";
import { FertilizanteCalcResponse, FertilizanteCalcRequest } from "../services/fertilizanteCalculate.interface";
import { createFertilizanteCalculate, getFertilizanteCalculate } from "../services/fertilizanteCalculate.actions";

interface FertilizanteCalculateStore {
  FertilizanteCalculates: FertilizanteCalcResponse[];
  loadFertilizanteCalculates: (sedeId: number, anioId: number) => Promise<void>;
  createFertilizanteCalculate: (
    sedeId: number,
    anioId: number,
  ) => Promise<void>;
}

export const useFertilizanteCalculateStore = create<FertilizanteCalculateStore>(
  (set) => ({
    FertilizanteCalculates: [],
    loadFertilizanteCalculates: async (sedeId: number, anioId: number) => {
      try {
        const data = await getFertilizanteCalculate(sedeId, anioId);
        set({ FertilizanteCalculates: data });
      } catch (error) {
        console.error("Error loading Fertilizante calculates data:", error);
      }
    },
    createFertilizanteCalculate: async (
      sedeId: number,
      anioId: number,
    ) => {
      try {
        const requestData: FertilizanteCalcRequest = {
          sedeId,
          anioId,
        };
        const data = await createFertilizanteCalculate(requestData);
        console.log("Fertilizante calculate created:", data);
      } catch (error) {
        console.error("Error creating Fertilizante calculate:", error);
      }
    },
  })
);
