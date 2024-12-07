import {useQuery} from "@tanstack/react-query";
import {getTiposExtintorPaginate} from "../services/tipoExtintor.actions";

export const useTipoExtintor = (name: string, page: number) => {
    return useQuery({
        queryKey: ['tiposExtintorPage'],
        queryFn: () => getTiposExtintorPaginate(name, page),
        refetchOnWindowFocus: false,
    });
}