import {useQuery} from "@tanstack/react-query";

import {getTransporteTerrestreFactorPaginate} from "../services/transporteTerrestreFactor.actions";

export interface TransporteTerrestreFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useTransporteTerrestreFactorPaginate = (
    {
        anioId,
        page,
        perPage,
    }: TransporteTerrestreFactorIndex
) => {
    return useQuery({
        queryKey: ['factorTransporteTerrestre'],
        queryFn: () => getTransporteTerrestreFactorPaginate({
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}

