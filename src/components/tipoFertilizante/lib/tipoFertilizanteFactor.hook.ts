import {useQuery} from "@tanstack/react-query";
import {getFactorEmisionFertilizantePage} from "@/components/tipoFertilizante/services/tipoFertilizanteFactor.actions";


export interface FactorEmisionFertilizanteIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useFertilizanteFactor = (
    {
        anioId,
        page,
        perPage,
    }: FactorEmisionFertilizanteIndex
) => {
    return useQuery({
        queryKey: ['factorEmisionFertilizante'],
        queryFn: () => getFactorEmisionFertilizantePage({
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}
