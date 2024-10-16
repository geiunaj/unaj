import {useQuery} from "@tanstack/react-query";
import {getAnio} from "@/components/anio/services/anio.actions";

export const useAnio = () => {
    return useQuery({
        queryKey: ['anio'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
}