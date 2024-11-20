import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getActivo, getActivoById, getActivoReport} from "@/components/activos/services/activos.actions";
import {getTiposActivo} from "@/components/tipoActivo/services/tipoActivo.actions";

interface getActivoInterface {
    tipoActivoId?: number;
    claseActivo?: string;
    sedeId?: number;
    from?: string;
    to?: string;
    sort?: string;
    direction?: string;
    page?: number;
}

export const useActivo =
    ({
         tipoActivoId,
         sedeId,
         from,
         to,
         sort,
         direction,
         page
     }: getActivoInterface) => {
        return useQuery({
            queryKey: ['consumibleH'],
            queryFn: () => getActivo(tipoActivoId, sedeId, from, to, sort, direction, page),
            refetchOnWindowFocus: false,
        });
    }

export const useActivoReport =
    ({
         tipoActivoId,
         claseActivo,
         sedeId,
         from,
         to,
         sort,
         direction,
     }: getActivoInterface) => {
        return useQuery({
            queryKey: ['consumibleReportH'],
            queryFn: () => getActivoReport(tipoActivoId, claseActivo, sedeId, from, to, sort, direction),
            refetchOnWindowFocus: false,
        });
    }

export const useTipoActivo = () => {
    return useQuery({
        queryKey: ['tipoActivoH'],
        queryFn: () => getTiposActivo(),
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

export const useActivoId = (id: number) => {
    return useQuery({
        queryKey: ["consumibleH", id],
        queryFn: () => getActivoById(id),
        refetchOnWindowFocus: false,
    });
}