import {useQuery} from "@tanstack/react-query";
import {getFactorEmisionConsumiblePage} from "@/components/tipoConsumible/services/tipoConsumibleFactor.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getTiposConsumible} from "@/components/tipoConsumible/services/tipoConsumible.actions";


export interface FactorEmisionConsumibleIndex {
    tipoConsumibleId?: string;
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useAnio = () => {
    return useQuery({
        queryKey: ['anioTCSF'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
}

export const useTipoConsumible = () => {
    return useQuery({
        queryKey: ['tipoConsumibleF'],
        queryFn: () => getTiposConsumible(),
        refetchOnWindowFocus: false,
    });
}

export const useConsumibleFactor = (
    {
        tipoConsumibleId,
        anioId,
        page,
        perPage,
    }: FactorEmisionConsumibleIndex
) => {
    return useQuery({
        queryKey: ['factorEmisionConsumible'],
        queryFn: () => getFactorEmisionConsumiblePage({
            tipoConsumibleId,
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}
