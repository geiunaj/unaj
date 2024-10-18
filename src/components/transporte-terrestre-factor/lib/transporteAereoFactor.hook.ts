import {useQuery} from "@tanstack/react-query";

import {getTransporteAereoFactorPaginate} from "../services/transporteAereoFactor.actions";

export interface TransporteAereoFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useTransporteAereoFactorPaginate = (
    {
        anioId,
        page,
        perPage,
    }: TransporteAereoFactorIndex
) => {
    return useQuery({
        queryKey: ['factorConversionSEIN'],
        queryFn: () => getTransporteAereoFactorPaginate({
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}

