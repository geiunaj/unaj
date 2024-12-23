import {useQuery} from "@tanstack/react-query";
import {getFactorEmisionFertilizantePage} from "@/components/tipoFertilizante/services/tipoFertilizanteFactor.actions";


export interface FactorEmisionFertilizanteIndex {
    tipoFertilizanteId?: string;
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useFertilizanteFactor = (
    {
        tipoFertilizanteId,
        anioId,
        page,
        perPage,
    }: FactorEmisionFertilizanteIndex
) => {
    return useQuery({
        queryKey: ['factorEmisionFertilizante'],
        queryFn: () => getFactorEmisionFertilizantePage({
            tipoFertilizanteId,
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}
