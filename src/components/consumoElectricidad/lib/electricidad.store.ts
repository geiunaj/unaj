import {create} from "zustand";

import {electricidadCollection, electricidadRequest} from "../services/electricidad.interface";
import {
    createElectricidad,
    deleteElectricidad,
    getElectricidad,
    getElectricidadById,
    updateElectricidad
} from "../services/electricidad.actions";

type sort =
    | "id"
    | "area"
    | "numeroSuministro"
    | "consumo"
    | "mes_id"
    | "anio_id"
    | "sede_id";
type direction = "asc" | "desc";

interface ElectricidadStore {
    Electricidad: electricidadCollection[];
    loadElectricidad: (options: {
        sedeId: number;
        anioId: number;
        areaId: number;
        mesId?: number;
        sort?: sort;
        direction?: direction;
    }) => void;
    createElectricidad: (Electricidad: electricidadRequest) => Promise<void>;
    showElectricidad: (id: number) => Promise<any>;
    updateElectricidad: (id: number, Electricidad: electricidadRequest) => Promise<void>;
    deleteElectricidad: (id: number) => Promise<any>;
}

export const useElectricidadStore = create<ElectricidadStore>((set) => ({
    Electricidad: [],
    loadElectricidad: async (
        {sedeId, anioId, areaId, mesId, sort, direction}: {
            sedeId: number;
            anioId: number;
            areaId: number;
            mesId?: number;
            sort?: sort;
            direction?: direction;
        }
    ) => {
        try {
            const data = await getElectricidad(sedeId, anioId, areaId, mesId, sort, direction);
            set({Electricidad: data});
        } catch (error) {
            console.error("Error loading Electricidad data:", error);
        }
    },
    createElectricidad: async (Electricidad: electricidadRequest) => {
        try {
            const data = await createElectricidad(Electricidad);
            console.log("Electricidad created:", data);
        } catch (error) {
            console.error("Error creating Electricidad:", error);
        }
    },
    showElectricidad: async (id: number): Promise<any> => {
        try {
            return await getElectricidadById(id);
        } catch (error) {
            console.error("Error loading Electricidad:", error);
        }
    },
    updateElectricidad: async (id: number, Electricidad: electricidadRequest) => {
        try {
            const data = await updateElectricidad(id, Electricidad);
            console.log("Electricidad updated:", data);
        } catch (error) {
            console.error("Error updating Electricidad data:", error);
        }
    },
    deleteElectricidad: async (id: number) => {
        try {
            const data = await deleteElectricidad(id);
            console.log("Electricidad deleted:", data);
        } catch (error) {
            console.error("Error deleting Electricidad:", error);
        }
    },
}));
