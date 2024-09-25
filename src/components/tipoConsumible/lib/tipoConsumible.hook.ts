import {useQuery} from "@tanstack/react-query";
import {getTiposConsumiblePaginate} from "../services/tipoConsumible.actions";

export const useTipoConsumible = (page: number) => {
    return useQuery({
        queryKey: ['tiposConsumiblePage'],
        queryFn: () => getTiposConsumiblePaginate(page),
        refetchOnWindowFocus: false,
    });
}