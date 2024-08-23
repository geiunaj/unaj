import {useQuery} from "@tanstack/react-query";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {getArea} from "@/components/area/services/area.actions";
import {getConsumoAgua, getConsumoAguaReport} from "../services/consumoAgua.actions";

interface getConsumoAguaInterface {
    sedeId?: number;
    areaId?: number;
    anioId?: number;
    mesId?: number;
    sort?: string;
    direction?: string;
    page?: number;
    from?: string;
    to?: string;
}

export const useConsumoAgua = ({
                                   sedeId,
                                   areaId,
                                   anioId,
                                   mesId,
                                   sort,
                                   direction,
                                   page,
                               }: getConsumoAguaInterface) => {
    return useQuery({
        queryKey: ["ConsumoAgua"],
        queryFn: () => getConsumoAgua(sedeId, areaId, anioId, mesId, sort, direction, page),
        refetchOnWindowFocus: false,
    });
};

export const useConsumoAguaReport = ({
                                         sedeId,
                                         areaId,
                                         anioId,
                                         mesId,
                                         sort,
                                         direction,
                                         page,
                                         from,
                                         to
                                     }: getConsumoAguaInterface) => {
    return useQuery({
        queryKey: ["ConsumoAguaReport"],
        queryFn: () => getConsumoAguaReport(sedeId, areaId, anioId, mesId, sort, direction, page, from, to),
        refetchOnWindowFocus: false,
    });
};

export const useAnio = () => {
    return useQuery({
        queryKey: ["anio"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
};

export const useMes = () => {
    return useQuery({
        queryKey: ["mes"],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });
};

export const useArea = (sedeId: number) => {
    return useQuery({
        queryKey: ["area"],
        queryFn: () => getArea(sedeId),
        refetchOnWindowFocus: false,
    });
};
