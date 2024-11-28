import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {
    getConsumoPapel,
    getConsumoPapelById,
    getConsumoPapelReport
} from "@/components/consumoPapel/services/consumoPapel.actions";
import {getTiposPapel} from "@/components/tipoPapel/services/tipoPapel.actions";
import {getAnio} from "@/components/anio/services/anio.actions";

interface getConsumoPapelInterface {
    tipoPapelId?: number;
    sedeId?: number;
    from?: string;
    to?: string;
    sort?: string;
    direction?: string;
    page?: number;


}

export const useConsumosPapel = (
    {
        tipoPapelId,
        sedeId,
        from,
        to,
        sort,
        direction,
        page,
    }: getConsumoPapelInterface) => {
    return useQuery({
        queryKey: ['consumoPapelQuery'],
        queryFn: () => getConsumoPapel(tipoPapelId, sedeId, from, to, sort, direction, page),
        refetchOnWindowFocus: false,
    });
}

export const useConsumoPapelReport =
    ({
         tipoPapelId,
         sedeId,
         from,
         to,
         sort,
         direction,
     }: getConsumoPapelInterface) => {
        return useQuery({
            queryKey: ['consumoPapelReport'],
            queryFn: () => getConsumoPapelReport(tipoPapelId, sedeId, from, to, sort, direction),
            refetchOnWindowFocus: false,
        });
    }

export const useSedes = () => {
    return useQuery({
        queryKey: ['sedeQuery'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    })
}

export const useTipoPapel = () => {
    return useQuery({
        queryKey: ['tiposPapel'],
        queryFn: () => getTiposPapel(),
        refetchOnWindowFocus: false,
    });
}

export const useAnios = () => {
    return useQuery({
        queryKey: ['anios'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
}


export const useConsumoPapelId = (id: number) => {
    return useQuery({
        queryKey: ["taxi", id],
        queryFn: () => getConsumoPapelById(id),
        refetchOnWindowFocus: false,
    });
}