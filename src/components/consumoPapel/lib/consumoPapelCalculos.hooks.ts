import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {
    getConsumoPapelCalculate,
    getConsumoPapelCalculateReport
} from "@/components/consumoPapel/services/consumoPapelCalculate.actions";

interface getConsumoPapelCalculoInterface {
    sedeId: number;
    from?: string;
    to?: string;
    page?: number;
}

export const useConsumoPapelCalculos =
    ({sedeId, from, to, page}: getConsumoPapelCalculoInterface) => {
        return useQuery({
            queryKey: ['consumoPapelCalculos'],
            queryFn: () => getConsumoPapelCalculate({sedeId, from, to, page}),
            refetchOnWindowFocus: false,
        });
    }
export const useConsumoPapelCalculosReport =
    ({sedeId, from, to}: getConsumoPapelCalculoInterface) => {
        return useQuery({
            queryKey: ['consumoPapelCalculosReport'],
            queryFn: () => getConsumoPapelCalculateReport({sedeId, from, to}),
            refetchOnWindowFocus: false,
        });
    }

export const useSedes = () => {
    return useQuery({
        queryKey: ['sedeCPC'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
}

export const useAnio = () => {
    return useQuery({
        queryKey: ['anioCPC'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
}

export const useMeses = () => {
    return useQuery({
        queryKey: ['mesCPC'],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });
}