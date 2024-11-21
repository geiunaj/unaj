import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {
    getActivoCalculate,
    getActivoCalculateReport
} from "@/components/activos/services/activosCalculate.actions";

interface getActivoCalculoInterface {
    sedeId: number;
    from?: string;
    to?: string;
    page?: number;
}

export const useActivoCalculos =
    ({sedeId, from, to, page}: getActivoCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculos'],
            queryFn: () => getActivoCalculate({sedeId, from, to, page}),
            refetchOnWindowFocus: false,
        });
    }
export const useActivoCalculosReport =
    ({sedeId, from, to}: getActivoCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculosReport'],
            queryFn: () => getActivoCalculateReport({sedeId, from, to}),
            refetchOnWindowFocus: false,
        });
    }

export const useSedes = () => {
    return useQuery({
        queryKey: ['sedeFC'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
}

export const useAnio = () => {
    return useQuery({
        queryKey: ['anioFC'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
}

export const useMeses = () => {
    return useQuery({
        queryKey: ['mesFC'],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });
}