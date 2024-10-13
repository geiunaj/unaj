import {useQuery} from "@tanstack/react-query";
import {getTransporteAereo, getTransporteAereoById, getTransporteAereoReport} from "../service/transporteAereo.actions";
import {getConsumibleReport} from "@/components/consumibles/services/consumible.actions";

interface getTransporteAereoInterface {
    sedeId?: number;
    sort?: string;
    direction?: string;
    page?: number;
    from?: string;
    to?: string;
}

export const useTransporteAereo = ({
                                       sedeId,
                                       from,
                                       to,
                                       sort,
                                       direction,
                                       page,
                                   }: getTransporteAereoInterface) => {
    return useQuery({
        queryKey: ["transporteAereo"],
        queryFn: () => getTransporteAereo(sedeId, from, to, sort, direction, page),
        refetchOnWindowFocus: false,
    });
}

export const useTransporteAereoReport =
    ({
         sedeId,
         from,
         to,
         sort,
         direction,
     }: getTransporteAereoInterface) => {
        return useQuery({
            queryKey: ['consumibleReportH'],
            queryFn: () => getTransporteAereoReport(sedeId, from, to, sort, direction),
            refetchOnWindowFocus: false,
        });
    }


export const useTransporteAereoId = (id: number) => {
    return useQuery({
        queryKey: ["transporteAereo", id],
        queryFn: () => getTransporteAereoById(id),
        refetchOnWindowFocus: false,
    });
}