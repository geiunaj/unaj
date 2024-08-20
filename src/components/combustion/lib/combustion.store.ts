// import {create} from "zustand";
// import {CombustionCollection, CombustionRequest,} from "../services/combustion.interface";
// import {
//     createCombustion,
//     deleteCombustion,
//     getCombustion,
//     getCombustionById,
//     updateCombustion,
// } from "../services/combustion.actions";

// type tipoForm = "estacionaria" | "movil";
// type sort =
//     | "id"
//     | "tipo"
//     | "tipoEquipo"
//     | "consumo"
//     | "tipoCombustible_id"
//     | "mes_id"
//     | "anio_id"
//     | "sede_id";
// type direction = "asc" | "desc";

// interface CombustionStore {
//     combustion: CombustionCollection[];
//     loadCombustion: (options?: {
//         tipo?: tipoForm;
//         sedeId?: number;
//         sort?: sort;
//         direction?: direction;
//         anioId?: number;
//         mesId?: number;
//         tipoCombustibleId?: number;
//     }) => void;
//     createCombustion: (combustion: CombustionRequest) => Promise<void>;
//     showCombustion: (id: number) => Promise<any>;
//     updateCombustion: (id: number, combustion: CombustionRequest) => Promise<void>;
//     deleteCombustion: (id: number) => Promise<any>;
// }

// export const useCombustionStore = create<CombustionStore>((set) => ({
//     combustion: [],
//     loadCombustion: async ({
//                                tipo,
//                                sedeId,
//                                sort,
//                                direction,
//                                anioId,
//                                mesId,
//                                tipoCombustibleId,
//                            }: {
//         tipo?: tipoForm;
//         sedeId?: number;
//         sort?: sort;
//         direction?: direction;
//         anioId?: number;
//         mesId?: number;
//         tipoCombustibleId?: number;
//     } = {}) => {
//         try {
//             const data = await getCombustion(tipo, sedeId, sort, direction, anioId, mesId, tipoCombustibleId);
//             set({combustion: data});
//         } catch (error) {
//             console.error("Error loading combustion data:", error);
//         }
//     },
//     createCombustion: async (combustion: CombustionRequest) => {
//         try {
//             const data = await createCombustion(combustion);
//             console.log("Combustion created:", data);
//         } catch (error) {
//             console.error("Error creating combustion:", error);
//         }
//     },
//     showCombustion: async (id: number): Promise<any> => {
//         try {
//             return await getCombustionById(id);
//         } catch (error) {
//             console.error("Error loading combustion:", error);
//         }
//     },
//     updateCombustion: async (id: number, combustion: CombustionRequest) => {
//         try {
//             const data = await updateCombustion(id, combustion);
//             console.log("Combustion updated:", data);
//         } catch (error) {
//             console.error("Error updating combustion data:", error);
//         }
//     },
//     deleteCombustion: async (id: number) => {
//         try {
//             const data = await deleteCombustion(id);
//             console.log("Combustion deleted:", data);
//         } catch (error) {
//             console.error("Error deleting combustion:", error);
//         }
//     },
// }));
