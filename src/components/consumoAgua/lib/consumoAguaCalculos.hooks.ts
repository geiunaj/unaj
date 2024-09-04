import {useQuery} from "@tanstack/react-query";
import {
    getConsumoAguaCalculos,
    getConsumoAguaCalculosReport
} from "@/components/consumoAgua/services/consumoAguaCalculos.actions";

interface getElectricidadCalculoInterface {
    sedeId?: number;
    from?: string;
    to?: string;
    page?: number;
}

export const useConsumoAguaCalculos =
    ({sedeId, from, to, page}: getElectricidadCalculoInterface) => {
        return useQuery({
            queryKey: ['consumoAguaCalculos'],
            queryFn: () => getConsumoAguaCalculos({
                sedeId, from, to, page,
            }),
            refetchOnWindowFocus: false,
        });
    }

export const useConsumoAguaCalculosReport =
    ({sedeId, from, to}: getElectricidadCalculoInterface) => {
        return useQuery({
            queryKey: ['consumoAguaCalculosReport'],
            queryFn: () => getConsumoAguaCalculosReport({
                sedeId, from, to,
            }),
            refetchOnWindowFocus: false,
        });
    }
