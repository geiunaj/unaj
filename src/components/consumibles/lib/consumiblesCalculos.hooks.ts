import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {
    getConsumibleCalculate,
    getConsumibleCalculateReport
} from "@/components/consumibles/services/consumibleCalculate.actions";

interface getConsumibleCalculoInterface {
    sedeId: number;
    yearFrom?: string;
    yearTo?: string;
    page?: number;
}

export const useConsumibleCalculos =
    ({sedeId, yearFrom, yearTo, page}: getConsumibleCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculos'],
            queryFn: () => getConsumibleCalculate({sedeId, yearFrom, yearTo, page}),
            refetchOnWindowFocus: false,
        });
    }
export const useConsumibleCalculosReport =
    ({sedeId, yearFrom, yearTo}: getConsumibleCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculosReport'],
            queryFn: () => getConsumibleCalculateReport({sedeId, yearFrom, yearTo}),
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