import {create} from "zustand";
import {getClaseFertilizante} from "../services/tipoFertilizante.actions";
import {ClaseFertilizante} from "../services/tipoFertilizante.interface";


interface ClaseFertilizanteStore {
    claseFertilizante: ClaseFertilizante[];
    loadClaseFertilizante: () => void;
}

export const useClaseFertilizante = create<ClaseFertilizanteStore>((set) => ({
    claseFertilizante: [],
    loadClaseFertilizante: async () => {
        try {
            const data = await getClaseFertilizante();
            console.log(data);
            set({claseFertilizante: data});
        } catch (error) {
            console.error("Error loading tipos de combustible data:", error);
        }
    },
}));
