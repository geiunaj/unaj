import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {
    getTransporteCasaTrabajo,
    getTransporteCasaTrabajoById,
    getTransporteCasaTrabajoReport
} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajo.actions";
import {getTiposVehiculo} from "@/components/tipoVehiculo/services/tipoVehiculo.actions";

interface getTransporteCasaTrabajoInterface {
    tipoVehiculoId?: number;
    tipo?: string;
    claseTransporteCasaTrabajo?: string;
    sedeId?: number;
    from?: string;
    to?: string;
    sort?: string;
    direction?: string;
    page?: number;
}

export const useTransporteCasaTrabajo =
    ({
         tipoVehiculoId,
         tipo,
         sedeId,
         from,
         to,
         sort,
         direction,
         page
     }: getTransporteCasaTrabajoInterface) => {
        return useQuery({
            queryKey: ['transporteCasaTrabajoH'],
            queryFn: () => getTransporteCasaTrabajo(tipoVehiculoId, tipo, sedeId, from, to, sort, direction, page),
            refetchOnWindowFocus: false,
        });
    }

export const useTransporteCasaTrabajoReport =
    ({
         tipoVehiculoId,
         tipo,
         claseTransporteCasaTrabajo,
         sedeId,
         from,
         to,
         sort,
         direction,
     }: getTransporteCasaTrabajoInterface) => {
        return useQuery({
            queryKey: ['transporteCasaTrabajoReportH'],
            queryFn: () => getTransporteCasaTrabajoReport(tipoVehiculoId, tipo, claseTransporteCasaTrabajo, sedeId, from, to, sort, direction),
            refetchOnWindowFocus: false,
        });
    }

export const useTipoVehiculos = () => {
    return useQuery({
        queryKey: ['tipoVehiculoH'],
        queryFn: () => getTiposVehiculo(),
        refetchOnWindowFocus: false,
    });
}

export const useSede = () => {
    return useQuery({
        queryKey: ['sedeH'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
}

export const useAnio = () => {
    return useQuery({
        queryKey: ['anioH'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
}

export const useTransporteCasaTrabajoId = (id: number) => {
    return useQuery({
        queryKey: ["transporteCasaTrabajoH", id],
        queryFn: () => getTransporteCasaTrabajoById(id),
        refetchOnWindowFocus: false,
    });
}