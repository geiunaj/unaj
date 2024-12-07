import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sedes/services/sedes.actions";

export const useSedes = () => {
    return useQuery({
        queryKey: ['sedes'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
}