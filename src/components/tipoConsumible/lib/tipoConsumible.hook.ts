import {useQuery} from "@tanstack/react-query";
import {getClaseFertilizante, getTiposFertilizante} from "../services/tipoFertilizante.actions";


export const useTipoFertilizante = (selectedClase: string) => {
    return useQuery({
        queryKey: ['tiposFertilizante'],
        queryFn: () => getTiposFertilizante(selectedClase),
        refetchOnWindowFocus: false,
    });
}

export const useClaseFertilizante = () => {
    return useQuery({
        queryKey: ['claseFertilizante'],
        queryFn: () => getClaseFertilizante(),
        refetchOnWindowFocus: false,
    });
}