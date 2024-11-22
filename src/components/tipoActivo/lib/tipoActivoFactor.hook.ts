import {useQuery} from "@tanstack/react-query";
import {getFactorEmisionActivoPage} from "@/components/tipoActivo/services/tipoActivoFactor.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getTiposActivo} from "../services/tipoActivo.actions";
import {getGrupoActivo} from "@/components/tipoActivo/services/grupoActivo.actions";

export interface FactorEmisionActivoIndex {
    grupoActivoId?: string;
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

export const useTipoActivo = () => {
    return useQuery({
        queryKey: ["tipoActivoF"],
        queryFn: () => getTiposActivo(),
        refetchOnWindowFocus: false,
    });
};

export const useGrupoActivo = () => {
    return useQuery({
        queryKey: ["grupoActivoF"],
        queryFn: () => getGrupoActivo(),
        refetchOnWindowFocus: false,
    });
}

export const useActivoFactor = ({
                                    grupoActivoId,
                                    anioId,
                                    page,
                                    perPage,
                                }: FactorEmisionActivoIndex) => {
    return useQuery({
        queryKey: ["factorEmisionActivo"],
        queryFn: () =>
            getFactorEmisionActivoPage({
                grupoActivoId,
                anioId,
                page,
                perPage,
            }),
        refetchOnWindowFocus: false,
    });
};
