import {useQuery} from "@tanstack/react-query";
import {getSummary} from "@/components/resumen/service/resumen.actions";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";

interface getResumenInterface {
    sedeId?: number;
    from?: string;
    to?: string;
}

export const useSummary = ({
                               sedeId,
                               from,
                               to,
                           }: getResumenInterface) => {
    return useQuery({
        queryKey: ["summary"],
        queryFn: () => getSummary(sedeId, from, to),
        refetchOnWindowFocus: false,
    });
}

export const useSedes = () => {
    return useQuery({
        queryKey: ['sedeSummaryQuery'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    })
}

export const useYears = () => {
    return useQuery({
        queryKey: ['yearsSummaryQuery'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    })
}