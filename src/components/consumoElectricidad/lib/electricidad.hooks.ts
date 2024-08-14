import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import { getElectricidad } from "../services/electricidad.actions";
import { getArea } from "@/components/area/services/area.actions";

interface getElectricidadInterface {
    sedeId?: number ;
    anioId?: number;
    mesId?: number;
    areaId?: number;
    sort?: string;
    direction?: string;
}

export const useElectricidad =
    ({ sedeId, anioId, mesId, areaId,sort, direction}: getElectricidadInterface) => {
        return useQuery({
            queryKey: ['Electricidad'],
            queryFn: () => getElectricidad(sedeId, anioId, areaId, mesId, sort, direction),
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

export const useMes = () => {
    return useQuery({
        queryKey: ['mes'],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });
}

export const useArea = () => {
    return useQuery({
        queryKey: ['area'],
        queryFn: () => getArea(),
        refetchOnWindowFocus: false,
    });
}