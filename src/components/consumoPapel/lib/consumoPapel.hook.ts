import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getConsumoPapel, getConsumoPapelById} from "@/components/consumoPapel/services/consumoPapel.actions";
import {getTiposPapel} from "@/components/tipoPapel/services/tipoPapel.actions";
import {getAnio} from "@/components/anio/services/anio.actions";

interface getConsumoPapelInterface {
    sedeId?: number;
    anioId?: number;
    sort?: string;
    direction?: string;
  
    page?: number;
  }

export const useConsumosPapel = (
    {
        sedeId,
        anioId,
        sort,
        direction,
        page,
    }: getConsumoPapelInterface) => {
    return useQuery({
        queryKey: ['consumoPapelQuery'],
        queryFn: () => getConsumoPapel(sedeId, anioId, sort, direction, page),
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