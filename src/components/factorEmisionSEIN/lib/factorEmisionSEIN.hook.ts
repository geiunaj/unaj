import {useQuery} from "@tanstack/react-query";

import { getFactorEmisionSEINPaginate } from "../services/factorEmisionSEIN.actions";

export interface FactorConversiónSEINndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useFactorEmisionSEINPaginate = (
    {
        anioId,
        page,
        perPage,
    }: FactorConversiónSEINndex
) => {
    return useQuery({
        queryKey: ['factorConversionSEIN'],
        queryFn: () => getFactorEmisionSEINPaginate({
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}

