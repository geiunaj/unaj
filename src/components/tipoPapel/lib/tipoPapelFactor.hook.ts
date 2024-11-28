import {useQuery} from "@tanstack/react-query";
import {getFactorEmisionPapelPage} from "@/components/tipoPapel/services/tipoPapelFactor.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getTiposPapel} from "../services/tipoPapel.actions";

export interface FactorEmisionPapelIndex {
    tipoPapelId?: string;
    anioId?: string;
    page?: number;
    perPage?: number;
}

export const useAnio = () => {
    return useQuery({
        queryKey: ["anioTCSF"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
};

export const useTipoPapel = () => {
    return useQuery({
        queryKey: ["tipoPapelF"],
        queryFn: () => getTiposPapel(),
        refetchOnWindowFocus: false,
    });
};

export const usePapelFactor = ({
                                   tipoPapelId,
                                   anioId,
                                   page,
                                   perPage,
                               }: FactorEmisionPapelIndex) => {
    return useQuery({
        queryKey: ["factorEmisionPapel"],
        queryFn: () =>
            getFactorEmisionPapelPage({
                tipoPapelId,
                anioId,
                page,
                perPage,
            }),
        refetchOnWindowFocus: false,
    });
};
