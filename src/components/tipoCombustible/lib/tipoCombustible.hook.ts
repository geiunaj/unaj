import {useQuery} from "@tanstack/react-query";
import {
    getTiposCombustible,
    getTiposCombustiblePaginate,
    TiposCombustibleIndex
} from "../services/tipoCombustible.actions";


export const useTipoCombustiblePaginate = (
    {
        tipoCombustibleId,
        page,
        perPage,
    }: TiposCombustibleIndex
) => {
    return useQuery({
        queryKey: ['tiposCombustiblePaginate'],
        queryFn: () => getTiposCombustiblePaginate({
            tipoCombustibleId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}
export const useTipoCombustible = () => {
    return useQuery({
        queryKey: ['tiposCombustible'],
        queryFn: () => getTiposCombustible(),
        refetchOnWindowFocus: false,
    });
}

