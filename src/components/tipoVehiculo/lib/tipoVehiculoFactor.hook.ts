import {useQuery} from "@tanstack/react-query";
import {getFactorEmisionVehiculoPage} from "@/components/tipoVehiculo/services/tipoVehiculoFactor.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getTiposVehiculo} from "../services/tipoVehiculo.actions";

export interface FactorEmisionVehiculoIndex {
    tipoVehiculoId?: string;
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

export const useTipoVehiculo = () => {
    return useQuery({
        queryKey: ["tipoVehiculoF"],
        queryFn: () => getTiposVehiculo(),
        refetchOnWindowFocus: false,
    });
};

export const useVehiculoFactor = ({
                                      tipoVehiculoId,
                                      anioId,
                                      page,
                                      perPage,
                                  }: FactorEmisionVehiculoIndex) => {
    return useQuery({
        queryKey: ["factorEmisionVehiculo"],
        queryFn: () =>
            getFactorEmisionVehiculoPage({
                tipoVehiculoId,
                anioId,
                page,
                perPage,
            }),
        refetchOnWindowFocus: false,
    });
};
