import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {
    getRefrigeranteWCalculate,
    getRefrigeranteWCalculateReport
} from "@/components/fertilizantes/services/fertilizanteCalculate.actions";

interface getRefrigeranteWCalculoInterface {
    sedeId: number;
    yearFrom?: string;
    yearTo?: string;
    page?: number;
}

export const useRefrigeranteWCalculos =
    ({sedeId, yearFrom, yearTo, page}: getRefrigeranteWCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculos'],
            queryFn: () => getRefrigeranteWCalculate({sedeId, yearFrom, yearTo, page}),
            refetchOnWindowFocus: false,
        });
    }
export const useRefrigeranteWCalculosReport =
    ({sedeId, yearFrom, yearTo}: getRefrigeranteWCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculosReport'],
            queryFn: () => getRefrigeranteWCalculateReport({sedeId, yearFrom, yearTo}),
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