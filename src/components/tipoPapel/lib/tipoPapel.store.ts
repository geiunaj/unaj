import {create} from "zustand";
import {tipoPapel} from "../services/tipoPapel.interface";
import {getTiposPapel} from "../services/tipoPapel.actions";

interface TipoPapelStore {
    tiposPapel: tipoPapel[];
    loadTiposPapel: () => void;
    // createTipoCombustible: (sede: TipoCombustibleRequest) => void;
    // showTipoCombustible: (id: number) => void;
    // updateTipoCombustible: (id: number, sede: TipoCombustibleRequest) => void;
    // deleteTipoCombustible: (id: number) => void;
}

export const useTipoPapelStore = create<TipoPapelStore>((set) => ({
    tiposPapel: [],
    loadTiposPapel: async () => {
        try {
            const data = await getTiposPapel();
            set({tiposPapel: data});
        } catch (error) {
            console.error("Error loading tipos de papel data:", error);
        }
    },
}));
