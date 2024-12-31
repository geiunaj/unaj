import {useQuery} from "@tanstack/react-query";

import {getConsumoAguaFactorPaginate} from "../services/ConsumoAguaFactor.actions";

export interface ConsumoAguaFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useConsumoAguaFactorPaginate = (
    {
        anioId,
        page,
        perPage,
    }: ConsumoAguaFactorIndex
) => {
    return useQuery({
        queryKey: ['factorConsumoAgua'],
        queryFn: () => getConsumoAguaFactorPaginate({
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}

