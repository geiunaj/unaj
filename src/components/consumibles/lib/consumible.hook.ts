import {useQuery} from "@tanstack/react-query";
import {
    getConsumible,
    getConsumibleById,
    getConsumibleReport
} from "@/components/consumibles/services/consumible.actions";
import {
    getClaseConsumible,
    getTiposConsumible
} from "@/components/tipoConsumible/services/tipoConsumible.actions";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";

interface getConsumibleInterface {
    tipoConsumibleId?: number;
    claseConsumible?: string;
    sedeId?: number;
    yearFrom?: string;
    yearTo?: string;
    sort?: string;
    direction?: string;
    page?: number;
}

export const useConsumible =
    ({
         tipoConsumibleId,
         sedeId,
         yearFrom,
         yearTo,
         sort,
         direction,
         page
     }: getConsumibleInterface) => {
        return useQuery({
            queryKey: ['consumible'],
            queryFn: () => getConsumible(tipoConsumibleId, sedeId, yearFrom, yearTo, sort, direction, page),
            refetchOnWindowFocus: false,
        });
    }

export const useConsumibleReport =
    ({
         tipoConsumibleId,
         claseConsumible,
         sedeId,
         yearFrom,
         yearTo,
         sort,
         direction,
     }: getConsumibleInterface) => {
        return useQuery({
            queryKey: ['consumibleReport'],
            queryFn: () => getConsumibleReport(tipoConsumibleId, claseConsumible, sedeId, yearFrom, yearTo, sort, direction),
            refetchOnWindowFocus: false,
        });
    }

export const useClaseConsumible = () => {
    return useQuery({
        queryKey: ['claseConsumible'],
        queryFn: () => getClaseConsumible(),
        refetchOnWindowFocus: false,
    });
}

export const useTipoConsumible = () => {
    return useQuery({
        queryKey: ['tipoConsumible'],
        queryFn: () => getTiposConsumible(),
        refetchOnWindowFocus: false,
    });
}

export const useSede = () => {
    return useQuery({
        queryKey: ['sede'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
}

export const useAnio = () => {
    return useQuery({
        queryKey: ['anio'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
}

export const useConsumibleId = (id: number) => {
    return useQuery({
        queryKey: ["consumible", id],
        queryFn: () => getConsumibleById(id),
        refetchOnWindowFocus: false,
    });
}