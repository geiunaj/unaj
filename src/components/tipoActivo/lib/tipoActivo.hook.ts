import {useQuery} from "@tanstack/react-query";
import { getTiposActivoPaginate } from "../services/tipoActivo.actions";

export const useTipoActivo = (name: string, page: number) => {
    return useQuery({
        queryKey: ['tiposActivoPage'],
        queryFn: () => getTiposActivoPaginate(name, page),
        refetchOnWindowFocus: false,
    });
}