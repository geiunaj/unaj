import {useQuery} from "@tanstack/react-query";
import {getConsumoAguaCalculos} from "@/components/consumoAgua/services/consumoAguaCalculos.actions";

interface getElectricidadCalculoInterface {
    sedeId?: number;
    from?: string;
    to?: string;
    page?: number;
}

export const useConsumoAguaCalculos =
    ({sedeId, from, to, page}: getElectricidadCalculoInterface) => {
        return useQuery({
            queryKey: ['electricidadCalculos'],
            queryFn: () => getConsumoAguaCalculos({
                sedeId, from, to, page,
            }),
            refetchOnWindowFocus: false,
        });
    }