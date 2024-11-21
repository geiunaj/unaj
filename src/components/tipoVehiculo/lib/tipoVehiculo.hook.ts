import {useQuery} from "@tanstack/react-query";
import {getTiposVehiculoPaginate} from "../services/tipoVehiculo.actions";

export const useTipoVehiculo = (name: string, page: number) => {
    return useQuery({
        queryKey: ['tiposVehiculoPage'],
        queryFn: () => getTiposVehiculoPaginate(name, page),
        refetchOnWindowFocus: false,
    });
}