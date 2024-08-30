import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {
    getFertilizanteCalculate,
    getFertilizanteCalculateReport
} from "@/components/fertilizantes/services/fertilizanteCalculate.actions";

interface getFertilizanteCalculoInterface {
    sedeId: number;
    yearFrom?: string;
    yearTo?: string;
    page?: number;
}

export const useFertilizanteCalculos =
    ({sedeId, yearFrom, yearTo, page}: getFertilizanteCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculos'],
            queryFn: () => getFertilizanteCalculate({sedeId, yearFrom, yearTo, page}),
            refetchOnWindowFocus: false,
        });
    }
export const useFertilizanteCalculosReport =
    ({sedeId, yearFrom, yearTo}: getFertilizanteCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculosReport'],
            queryFn: () => getFertilizanteCalculateReport({sedeId, yearFrom, yearTo}),
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