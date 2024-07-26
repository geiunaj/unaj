import {create} from "zustand";
import {TipoFertilizante} from "../services/tipoFertilizante.interface";
import {getTiposFertilizante} from "../services/tipoFertilizante.actions";
// import { TipoCombustible } from "../services/tipoCombustible.interface";
// import { getTiposCombustible } from "../services/tipoCombustible.actions";

interface TipoFertilizanteStore {
    tiposFertilizante: TipoFertilizante[];
    loadTiposFertilizante: () => Promise<void>;
    // createTipoCombustible: (sede: TipoCombustibleRequest) => void;
    // showTipoCombustible: (id: number) => void;
    // updateTipoCombustible: (id: number, sede: TipoCombustibleRequest) => void;
    // deleteTipoCombustible: (id: number) => void;
}

export const useTipoFertilizante = create<TipoFertilizanteStore>((set) => ({
    tiposFertilizante: [],
    loadTiposFertilizante: async () => {
        try {
            const data = await getTiposFertilizante();
            set({tiposFertilizante: data});
        } catch (error) {
            console.error("Error loading tipos de combustible data:", error);
        }
    },
}));
