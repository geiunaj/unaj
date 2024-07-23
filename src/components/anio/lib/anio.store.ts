import {create} from "zustand";
import {getAnio} from "../services/anio.actions";
import {Anio} from "@/components/anio/services/anio.interface";

interface AnioStore {
    anios: Anio[];
    loadAnios: () => void;

}

export const useAnioStore = create<AnioStore>((set) => ({
    anios: [],
    loadAnios: async () => {
        try {
            const data = await getAnio();
            set({anios: data});
        } catch (error) {
            console.error("Error loading años data:", error);
        }
    },
}));
