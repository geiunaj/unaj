import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {getElectricidad} from "../services/consumoAgua.actions";
import {getArea} from "@/components/area/services/area.actions";
import {getElectricidadCalculos} from "@/components/consumoElectricidad/services/electricidadCalculos.actions";

interface getElectricidadCalculoInterface {
    sedeId?: number;
    anioId?: number;

    page?: number;
}

export const useElectricidadCalculos =
    ({sedeId, anioId, page}: getElectricidadCalculoInterface) => {
        return useQuery({
            queryKey: ['electricidadCalculos'],
            queryFn: () => getElectricidadCalculos(sedeId, anioId, page),
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

export const useMeses = () => {
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