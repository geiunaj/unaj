import {useQuery} from "@tanstack/react-query";
import {
    getConsumible,
    getConsumibleById,
    getConsumibleReport
} from "@/components/consumibles/services/consumible.actions";
import {getTiposConsumible} from "@/components/tipoConsumible/services/tipoConsumible.actions";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";

interface getConsumibleInterface {
    tipoConsumibleId?: number;
    claseConsumible?: string;
    sedeId?: number;
    from?: string;
    to?: string;
    sort?: string;
    direction?: string;
    page?: number;
}

export const useConsumible =
    ({
         tipoConsumibleId,
         sedeId,
         from,
         to,
         sort,
         direction,
         page
     }: getConsumibleInterface) => {
        return useQuery({
            queryKey: ['consumibleH'],
            queryFn: () => getConsumible(tipoConsumibleId, sedeId, from, to, sort, direction, page),
            refetchOnWindowFocus: false,
        });
    }

export const useConsumibleReport =
    ({
         tipoConsumibleId,
         claseConsumible,
         sedeId,
         from,
         to,
         sort,
         direction,
     }: getConsumibleInterface) => {
        return useQuery({
            queryKey: ['consumibleReportH'],
            queryFn: () => getConsumibleReport(tipoConsumibleId, claseConsumible, sedeId, from, to, sort, direction),
            refetchOnWindowFocus: false,
        });
    }

export const useTipoConsumible = () => {
    return useQuery({
        queryKey: ['tipoConsumibleH'],
        queryFn: () => getTiposConsumible(),
        refetchOnWindowFocus: false,
    });
}

export const useSede = () => {
    return useQuery({
        queryKey: ['sedeH'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
}

export const useAnio = () => {
    return useQuery({
        queryKey: ['anioH'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
}

export const useConsumibleId = (id: number) => {
    return useQuery({
        queryKey: ["consumibleH", id],
        queryFn: () => getConsumibleById(id),
        refetchOnWindowFocus: false,
    });
}