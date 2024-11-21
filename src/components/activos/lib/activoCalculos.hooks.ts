import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {
    getTransporteCasaTrabajoCalculate,
    getTransporteCasaTrabajoCalculateReport
} from "@/components/activos/services/activosCalculate.actions";

interface getTransporteCasaTrabajoCalculoInterface {
    sedeId: number;
    from?: string;
    to?: string;
    page?: number;
}

export const useTransporteCasaTrabajoCalculos =
    ({sedeId, from, to, page}: getTransporteCasaTrabajoCalculoInterface) => {
        return useQuery({
            queryKey: ['TransporteCasaTrabajoCalculos'],
            queryFn: () => getTransporteCasaTrabajoCalculate({sedeId, from, to, page}),
            refetchOnWindowFocus: false,
        });
    }
export const useTransporteCasaTrabajoCalculosReport =
    ({sedeId, from, to}: getTransporteCasaTrabajoCalculoInterface) => {
        return useQuery({
            queryKey: ['TransporteCasaTrabajoCalculosReport'],
            queryFn: () => getTransporteCasaTrabajoCalculateReport({sedeId, from, to}),
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