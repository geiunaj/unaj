import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {
    getCombustionCalculate,
    getCombustionCalculateReport
} from "@/components/combustion/services/combustionCalculate.actions";

interface getCombustionCalculoInterface {
    tipo: string;
    sedeId?: number;
    from?: string;
    to?: string;
    page?: number;
}

export const useCombustionCalculos =
    ({tipo, sedeId, from, to, page}: getCombustionCalculoInterface) => {
        return useQuery({
            queryKey: ['coombustionCalculos'],
            queryFn: () => getCombustionCalculate({tipo, sedeId, from, to, page}),
            refetchOnWindowFocus: false,
        });
    }
export const useCombustionCalculosReport =
    ({tipo, sedeId, from, to}: getCombustionCalculoInterface) => {
        return useQuery({
            queryKey: ['coombustionCalculosReport'],
            queryFn: () => getCombustionCalculateReport({tipo, sedeId, from, to}),
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