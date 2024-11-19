import {useQuery} from "@tanstack/react-query";
import {getTiposConsumiblePaginate} from "../services/tipoConsumible.actions";

export const useTipoConsumible = (name: string, page: number) => {
    return useQuery({
        queryKey: ['tiposConsumiblePage'],
        queryFn: () => getTiposConsumiblePaginate(name, page),
        refetchOnWindowFocus: false,
    });
}