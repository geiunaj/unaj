import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getCombustion, getCombustionReport} from "@/components/combustion/services/combustion.actions";
import {getTiposCombustible} from "@/components/tipoCombustible/services/tipoCombustible.actions";
import {getMes} from "@/components/mes/services/mes.actions";

interface getCombustibleInterface {
    tipo: string;
    tipoCombustibleId?: number;
    sedeId?: number;
    from?: string;
    to?: string;
    mesId?: number;
    sort?: string;
    direction?: string;
    page?: number;
}

export const useCombustible =
    ({tipo, tipoCombustibleId, sedeId, from, to, mesId, sort, direction, page}: getCombustibleInterface) => {
        return useQuery({
            queryKey: ['combustible'],
            queryFn: () => getCombustion(tipo, tipoCombustibleId, sedeId, from, to, mesId, sort, direction, page),
            refetchOnWindowFocus: false,
        });
    }

export const useCombustibleReport =
    ({tipo, tipoCombustibleId, sedeId, from, to, mesId, sort, direction}: getCombustibleInterface) => {
        return useQuery({
            queryKey: ['combustibleRreport'],
            queryFn: () => getCombustionReport(tipo, tipoCombustibleId, sedeId, from, to, mesId, sort, direction),
            refetchOnWindowFocus: false,
        });
    }

export const useTipoCombustible = () => {
    return useQuery({
        queryKey: ['tipoCombustible'],
        queryFn: () => getTiposCombustible(),
        refetchOnWindowFocus: false,
    });
}

export const useSede = () => {
    return useQuery({
        queryKey: ['sede'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
}

export const useAnio = () => {
    return useQuery({
        queryKey: ['anio'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
}

export const useMes = () => {
    return useQuery({
        queryKey: ['mes'],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });
}