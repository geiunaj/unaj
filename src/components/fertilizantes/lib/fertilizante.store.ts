import {create} from "zustand";
import {
    fertilizanteCollection,
    FertilizanteRequest,
} from "../services/fertilizante.interface";
import {
    createFertilizante,
    deleteFertilizante,
    getFertilizante,
    getFertilizanteById,
    updateFertilizante,
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
        anioId?: number;
        sedeId?: number;
        sort?: sort;
        direction?: direction;
        tipoFertilizanteIds?: number;
        claseFertilizante?: string;
    }) => void;
    createFertilizante: (fertilizante: FertilizanteRequest) => Promise<void>;
    showFertiliante: (id: number) => Promise<any>;
    updateFertilizante: (id: number, fertilizante: FertilizanteRequest) => Promise<void>;
    deleteFertilizante: (id: number) => Promise<any>;
}

export const useFertilizanteStore = create<FertilizanteStore>((set) => ({
    fertilizante: [],
    loadFertilizante: async ({
                                 sedeId,
                                 sort,
                                 direction,
                                 anioId,
                                 tipoFertilizanteId,
                                 claseFertilizante,
                             }: {
        sedeId?: number;
        sort?: sort;
        direction?: direction;
        anioId?: number;
        tipoFertilizanteId?: number;
        claseFertilizante?: string;
    } = {}) => {
        try {
            const data = await getFertilizante(
                sedeId,
                sort,
                direction,
                anioId,
                tipoFertilizanteId,
                claseFertilizante
            );
            set({fertilizante: data});
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
    showFertiliante: async (id: number): Promise<any> => {
        try {
            const data = await getFertilizanteById(id);
            return data;
        } catch (error) {
            console.error("Error loading fertilizante:", error);
        }
    },
    updateFertilizante: async (id: number, fertilizante: FertilizanteRequest) => {
        try {
            const data = await updateFertilizante(id, fertilizante);
            console.log("Fertilizante updated:", data);
        } catch (error) {
            console.error("Error updating fertilizante data:", error);
        }
    },
    deleteFertilizante: async (id: number) => {
        try {
            const data = await deleteFertilizante(id);
            console.log("Fertilizante deleted:", data);
        } catch (error) {
            console.error("Error deleting fertilizante:", error);
        }
    },
}));
