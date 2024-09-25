import {useQuery} from "@tanstack/react-query";
import {getFactorEmisionConsumiblePage} from "@/components/tipoConsumible/services/tipoConsumibleFactor.actions";


export interface FactorEmisionConsumibleIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useConsumibleFactor = (
    {
        anioId,
        page,
        perPage,
    }: FactorEmisionConsumibleIndex
) => {
    return useQuery({
        queryKey: ['factorEmisionConsumible'],
        queryFn: () => getFactorEmisionConsumiblePage({
            anioId,
            page,
            perPage,
        }),
        refetchOnWindowFocus: false,
    });
}
