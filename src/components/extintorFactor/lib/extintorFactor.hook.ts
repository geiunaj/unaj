import {useQuery} from "@tanstack/react-query";

import {getExtintorFactorPaginate} from "../services/extintorFactor.actions";

export interface ExtintorFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useExtintorFactorPaginate = (
    {
        anioId,
        page,
        perPage,
    }: ExtintorFactorIndex
) => {
    return useQuery({
        queryKey: ['factorExtintor'],
        queryFn: () => getExtintorFactorPaginate({
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}

