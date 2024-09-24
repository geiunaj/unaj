import {useQuery} from "@tanstack/react-query";
import {
    getRefrigerante,
    getRefrigeranteById,
    getRefrigeranteReport
} from "@/components/refrigerantes/services/refrigerante.actions";
import {
    getClaseRefrigerante,
    getTiposRefrigerante
} from "@/components/tipoRefrigerante/services/tipoRefrigerante.actions";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";

interface getRefrigeranteInterface {
    tipoRefrigeranteId?: number;
    claseRefrigerante?: string;
    sedeId?: number;
    yearFrom?: string;
    yearTo?: string;
    sort?: string;
    direction?: string;
    page?: number;
}

export const useRefrigerante =
    ({
         tipoRefrigeranteId,
         claseRefrigerante,
         sedeId,
         yearFrom,
         yearTo,
         sort,
         direction,
         page
     }: getRefrigeranteInterface) => {
        return useQuery({
            queryKey: ['refrigerante'],
            queryFn: () => getRefrigerante(tipoRefrigeranteId, claseRefrigerante, sedeId, yearFrom, yearTo, sort, direction, page),
            refetchOnWindowFocus: false,
        });
    }

export const useRefrigeranteReport =
    ({
         tipoRefrigeranteId,
         claseRefrigerante,
         sedeId,
         yearFrom,
         yearTo,
         sort,
         direction,
     }: getRefrigeranteInterface) => {
        return useQuery({
            queryKey: ['refrigeranteReport'],
            queryFn: () => getRefrigeranteReport(tipoRefrigeranteId, claseRefrigerante, sedeId, yearFrom, yearTo, sort, direction),
            refetchOnWindowFocus: false,
        });
    }

export const useClaseRefrigerante = () => {
    return useQuery({
        queryKey: ['claseRefrigerante'],
        queryFn: () => getClaseRefrigerante(),
        refetchOnWindowFocus: false,
    });
}

export const useTipoRefrigerante = (clase: string) => {
    return useQuery({
        queryKey: ['tipoRefrigerante'],
        queryFn: () => getTiposRefrigerante(clase),
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

export const useRefrigeranteId = (id: number) => {
    return useQuery({
        queryKey: ["refrigerante", id],
        queryFn: () => getRefrigeranteById(id),
        refetchOnWindowFocus: false,
    });
}