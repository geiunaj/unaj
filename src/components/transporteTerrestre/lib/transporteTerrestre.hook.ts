import {useQuery} from "@tanstack/react-query";
import {
    getTransporteTerrestre,
    getTransporteTerrestreById,
    getTransporteTerrestreReport
} from "../service/transporteTerrestre.actions";
import {getConsumibleReport} from "@/components/consumibles/services/consumible.actions";

interface getTransporteTerrestreInterface {
    sedeId?: number;
    sort?: string;
    direction?: string;
    page?: number;
    from?: string;
    to?: string;
}

export const useTransporteTerrestre = ({
                                           sedeId,
                                           from,
                                           to,
                                           sort,
                                           direction,
                                           page,
                                       }: getTransporteTerrestreInterface) => {
    return useQuery({
        queryKey: ["transporteTerrestre"],
        queryFn: () => getTransporteTerrestre(sedeId, from, to, sort, direction, page),
        refetchOnWindowFocus: false,
    });
}

export const useTransporteTerrestreReport =
    ({
         sedeId,
         from,
         to,
         sort,
         direction,
     }: getTransporteTerrestreInterface) => {
        return useQuery({
            queryKey: ['consumibleReportH'],
            queryFn: () => getTransporteTerrestreReport(sedeId, from, to, sort, direction),
            refetchOnWindowFocus: false,
        });
    }


export const useTransporteTerrestreId = (id: number) => {
    return useQuery({
        queryKey: ["transporteTerrestre", id],
        queryFn: () => getTransporteTerrestreById(id),
        refetchOnWindowFocus: false,
    });
}