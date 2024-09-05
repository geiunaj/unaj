import {useQuery} from "@tanstack/react-query";
import {
    getTiposCombustible,
    TiposCombustibleIndex
} from "../services/tipoCombustible.actions";
import {getTiposCombustibleFactorPaginate} from "@/components/tipoCombustible/services/tipoCombustibleFactor.actions";


export const useTipoCombustibleFactorPaginate = (
    {
        tipoCombustibleId,
        page,
        perPage,
    }: TiposCombustibleIndex
) => {
    return useQuery({
        queryKey: ['tiposCombustibleFactorPaginate'],
        queryFn: () => getTiposCombustibleFactorPaginate({
            tipoCombustibleId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}
export const useTipoCombustible = () => {
    return useQuery({
        queryKey: ['tiposCombustibleFP'],
        queryFn: () => getTiposCombustible(),
        refetchOnWindowFocus: false,
    });
}

