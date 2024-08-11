import {useQuery} from "@tanstack/react-query";
import {getTiposPapel} from "@/components/tipoPapel/services/tipoPapel.actions";

export const useTipoPapel = () => {
    return useQuery({
        queryKey: ['tiposPapel'],
        queryFn: () => getTiposPapel(),
        refetchOnWindowFocus: false,
    });
}