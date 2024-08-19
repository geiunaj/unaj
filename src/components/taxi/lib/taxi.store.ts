import {create} from "zustand";
import {TaxiCollection, TaxiRequest} from "../service/taxi.interface";
import {createTaxi, deleteTaxi, getTaxi, getTaxiById, updateTaxi} from "../service/taxi.actions";


type tipoForm = "estacionaria" | "movil";
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

interface TaxiStore {
    taxi: TaxiCollection[];
    loadtaxi: (options?: {
        tipo?: tipoForm;
        sedeId?: number | undefined;
        sort?: sort;
        direction?: direction;
        anioId?: number | undefined;
        tipoCombustibleId?: number;
    }) => void;
    createtaxi: (taxi: TaxiRequest) => Promise<void>;
    showtaxi: (id: number) => Promise<any>;
    updatetaxi: (id: number, taxi: TaxiRequest) => Promise<void>;
    deletetaxi: (id: number) => Promise<any>;
}

export const usetaxiStore = create<TaxiStore>((set) => ({
    taxi: [],
    loadtaxi: async ({
                         sedeId,
                        //  sort,
                         direction,
                         anioId,
                         mesId,
                     }: {
        sedeId?: number | undefined;
        // sort?: sort;
        direction?: direction;
        anioId?: number | undefined;
        mesId?: number;
    } = {}) => {
        try {
            const data = await getTaxi(sedeId, direction as string, anioId, mesId);
            set({taxi: data});
        } catch (error) {
            console.error("Error loading taxi data:", error);
        }
    },
    createtaxi: async (taxi: TaxiRequest) => {
        try {
            const data = await createTaxi(taxi);
            console.log("taxi created:", data);
        } catch (error) {
            console.error("Error creating taxi:", error);
        }
    },
    showtaxi: async (id: number): Promise<any> => {
        try {
            return await getTaxiById(id);
        } catch (error) {
            console.error("Error loading taxi:", error);
        }
    },
    updatetaxi: async (id: number, taxi: TaxiRequest) => {
        try {
            const data = await updateTaxi(id, taxi);
            console.log("taxi updated:", data);
        } catch (error) {
            console.error("Error updating taxi data:", error);
        }
    },
    deletetaxi: async (id: number) => {
        try {
            const data = await deleteTaxi(id);
            console.log("taxi deleted:", data);
        } catch (error) {
            console.error("Error deleting taxi:", error);
        }
    },
}));
