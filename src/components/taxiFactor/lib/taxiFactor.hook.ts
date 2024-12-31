import {useQuery} from "@tanstack/react-query";

import {getTaxiFactorPaginate} from "../services/TaxiFactor.actions";

export interface TaxiFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useTaxiFactorPaginate = (
    {
        anioId,
        page,
        perPage,
    }: TaxiFactorIndex
) => {
    return useQuery({
        queryKey: ['factorTaxi'],
        queryFn: () => getTaxiFactorPaginate({
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}

