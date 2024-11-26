import {useQuery} from "@tanstack/react-query";
import {getTaxi, getTaxiById, getTaxiReport} from "../service/taxi.actions";

interface getTaxiInterface {
    sedeId?: number;
    from?: string;
    to?: string;
    mesId?: number;
    sort?: string;
    direction?: string;
    page?: number;
}

export const useTaxi = ({
                            sedeId,
                            from,
                            to,
                            mesId,
                            sort,
                            direction,
                            page,
                        }: getTaxiInterface) => {
    return useQuery({
        queryKey: ["taxi"],
        queryFn: () => getTaxi(sedeId, from, to, mesId, sort, direction, page),
        refetchOnWindowFocus: false,
    });
}

export const useTaxiReport = ({
                                  sedeId,
                                  from,
                                  to,
                                  mesId,
                                  sort,
                                  direction,
                              }: getTaxiInterface) => {
    return useQuery({
        queryKey: ["taxiReport"],
        queryFn: () => getTaxiReport(sedeId, from, to, mesId, sort, direction),
        refetchOnWindowFocus: false,
    });
}


export const useTaxiId = (id: number) => {
    return useQuery({
        queryKey: ["taxi", id],
        queryFn: () => getTaxiById(id),
        refetchOnWindowFocus: false,
    });
}