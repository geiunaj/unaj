import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {getElectricidad, getElectricidadReport} from "../services/electricidad.actions";
import {getArea} from "@/components/area/services/area.actions";

interface getElectricidadInterface {
    sedeId?: number;
    areaId?: number;
    from?: string;
    to?: string;
    mesId?: number;
    sort?: string;
    direction?: string;
    page?: number;
}

export const useElectricidad =
    ({sedeId, areaId, from, to, mesId, sort, direction, page}: getElectricidadInterface) => {
        return useQuery({
            queryKey: ['Electricidad'],
            queryFn: () => getElectricidad(sedeId, areaId, from, to, mesId, sort, direction, page),
            refetchOnWindowFocus: false,
        });
    }

export const useElectricidadReport =
    ({sedeId, areaId, from, to, mesId, sort, direction,}: getElectricidadInterface) => {
        return useQuery({
            queryKey: ['ElectricidadReport'],
            queryFn: () => getElectricidadReport(sedeId, areaId, from, to, mesId, sort, direction),
            refetchOnWindowFocus: false,
        });
    }

export const useSede = () => {
    return useQuery({
        queryKey: ['sedeCEP'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
}

export const useMes = () => {
    return useQuery({
        queryKey: ['mesCEP'],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });
}

export const useArea = (sedeId: number) => {
    return useQuery({
        queryKey: ['areaCEP'],
        queryFn: () => getArea(sedeId),
        refetchOnWindowFocus: false,
    });
}