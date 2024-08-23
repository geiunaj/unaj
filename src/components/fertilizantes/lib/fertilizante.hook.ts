import {useQuery} from "@tanstack/react-query";
import {
    getFertilizante,
    getFertilizanteById,
    getFertilizanteReport
} from "@/components/fertilizantes/services/fertilizante.actions";
import {
    getClaseFertilizante,
    getTiposFertilizante
} from "@/components/tipoFertilizante/services/tipoFertilizante.actions";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";

interface getFertilizanteInterface {
    tipoFertilizanteId?: number;
    claseFertilizante?: string;
    sedeId?: number;
    anio?: string;
    sort?: string;
    direction?: string;
    page?: number;
    yearFrom?: string;
    yearTo?: string;
}

export const useFertilizante =
    ({tipoFertilizanteId, claseFertilizante, sedeId, anio, sort, direction, page}: getFertilizanteInterface) => {
        return useQuery({
            queryKey: ['fertilizante'],
            queryFn: () => getFertilizante(tipoFertilizanteId, claseFertilizante, sedeId, anio, sort, direction, page),
            refetchOnWindowFocus: false,
        });
    }

export const useFertilizanteReport =
    ({
         tipoFertilizanteId,
         claseFertilizante,
         sedeId,
         anio,
         sort,
         direction,
         page,
         yearFrom,
         yearTo
     }: getFertilizanteInterface) => {
        return useQuery({
            queryKey: ['fertilizanteReport'],
            queryFn: () => getFertilizanteReport(tipoFertilizanteId, claseFertilizante, sedeId, anio, sort, direction, page, yearFrom, yearTo, true),
            refetchOnWindowFocus: false,
        });
    }

export const useClaseFertilizante = () => {
    return useQuery({
        queryKey: ['claseFertilizante'],
        queryFn: () => getClaseFertilizante(),
        refetchOnWindowFocus: false,
    });
}

export const useTipoFertilizante = (clase: string) => {
    return useQuery({
        queryKey: ['tipoFertilizante'],
        queryFn: () => getTiposFertilizante(clase),
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

export const useFertilizanteId = (id: number) => {
    return useQuery({
        queryKey: ["fertilizante", id],
        queryFn: () => getFertilizanteById(id),
        refetchOnWindowFocus: false,
    });
}