import {create} from "zustand";
import {
    createCombustionCalculate,
    getCombustionCalculate
} from "@/components/combustion/services/combustionCalculate.actions";
import {CombustionCalcResponse} from "@/components/combustion/services/combustionCalculate.interface";

interface CombustionCalculateStore {
    combustionCalculates: CombustionCalcResponse[];
    loadCombustionCalculates: (sedeId: number, anioId: number, tipo: string) => Promise<void>;
    createCombustionCalculate: (sedeId: number, anioId: number, tipo: string) => Promise<void>;
}

export const useCombustionCalculateStore = create<CombustionCalculateStore>((set) => ({
    combustionCalculates: [],
    loadCombustionCalculates: async (sedeId: number, anioId: number, tipo: string) => {
        try {
            const data = await getCombustionCalculate(sedeId, anioId, tipo);
            set({combustionCalculates: data});
        } catch (error) {
            console.error("Error loading combustion calculates data:", error);
        }
    },
    createCombustionCalculate: async (sedeId: number, anioId: number, tipo: string) => {
        try {
            const data = await createCombustionCalculate({sedeId, anioId, tipo});
            console.log("Combustion calculate created:", data);
        } catch (error) {
            console.error("Error creating combustion calculate:", error);
        }
    }
}));
