import {create} from "zustand";
import {CombustionCollection, CombustionRequest,} from "../services/combustion.interface";
import {createCombustion, getCombustion, getCombustionById,} from "../services/combustion.actions";

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
        anioId?: number;
    }) => void;
    createCombustion: (combustion: CombustionRequest) => void;
    showCombustion: (id: number) => Promise<any>;
    updateCombustion: (id: number, combustion: CombustionRequest) => void;
    deleteCombustion: (id: number) => void;
}

export const useCombustionStore = create<CombustionStore>((set) => ({
    combustion: [],
    loadCombustion: async ({
                               tipo,
                               sedeId,
                               sort,
                               direction,
                               anioId,
                           }: {
        tipo?: tipoForm;
        sedeId?: number;
        sort?: sort;
        direction?: direction;
        anioId?: number;
    } = {}) => {
        try {
            const data = await getCombustion(tipo, sedeId, sort, direction, anioId);
            set({combustion: data});
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
    showCombustion: async (id: number): Promise<any> => {
        try {
            return await getCombustionById(id);
        } catch (error) {
            console.error("Error loading combustion:", error);
        }
    },
    updateCombustion: (id: number, combustion: CombustionRequest) => {
        console.log("Update combustion:", id, combustion);
    },
    deleteCombustion: (id: number) => {
        console.log("Delete combustion:", id);
    },
}));
