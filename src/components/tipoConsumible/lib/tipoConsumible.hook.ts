import {useQuery} from "@tanstack/react-query";
import {getTiposConsumible} from "../services/tipoConsumible.actions";

export const useTipoConsumible = () => {
    return useQuery({
        queryKey: ['tiposConsumible'],
        queryFn: () => getTiposConsumible(),
        refetchOnWindowFocus: false,
    });
}