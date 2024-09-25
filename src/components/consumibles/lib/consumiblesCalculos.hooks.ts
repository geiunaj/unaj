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
    from?: string;
    to?: string;
    page?: number;
}

export const useConsumibleCalculos =
    ({sedeId, from, to, page}: getConsumibleCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculos'],
            queryFn: () => getConsumibleCalculate({sedeId, from, to, page}),
            refetchOnWindowFocus: false,
        });
    }
export const useConsumibleCalculosReport =
    ({sedeId, from, to}: getConsumibleCalculoInterface) => {
        return useQuery({
            queryKey: ['fertilizanteCalculosReport'],
            queryFn: () => getConsumibleCalculateReport({sedeId, from, to}),
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