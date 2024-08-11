import {useQuery} from "@tanstack/react-query";
import { getTiposCombustible } from "../services/tipoCombustible.actions";


export const useTipoCombustible = () => {
    return useQuery({
        queryKey: ['tiposCombustible'],
        queryFn: () => getTiposCombustible(),
        refetchOnWindowFocus: false,
    });
}
