import {create} from "zustand";
import {getArea} from "@/components/area/services/area.actions";
import {Area} from "@/components/area/services/area.interface";

interface AreaStore {
    areas: Area[];
    loadAreas: () => void;
}

export const useAreaStore = create<AreaStore>((set) => ({
    areas: [],
    loadAreas: async () => {
        try {
            const data: Area[] = await getArea();
            set({areas: data});
        } catch (error) {
            console.error("Error loading areas data:", error);
        }
    },
}));
