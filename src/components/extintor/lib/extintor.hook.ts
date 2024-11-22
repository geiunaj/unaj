import {useQuery} from "@tanstack/react-query";
import {
    getExtintor,
    getExtintorById,
    getExtintorReport
} from "../service/extintor.actions";

interface getExtintorInterface {
    sedeId?: number;
    sort?: string;
    direction?: string;
    page?: number;
    from?: string;
    to?: string;
}

export const useExtintor = ({
                                sedeId,
                                from,
                                to,
                                sort,
                                direction,
                                page,
                            }: getExtintorInterface) => {
    return useQuery({
        queryKey: ["extintor"],
        queryFn: () => getExtintor(sedeId, from, to, sort, direction, page),
        refetchOnWindowFocus: false,
    });
}

export const useExtintorReport =
    ({
         sedeId,
         from,
         to,
         sort,
         direction,
     }: getExtintorInterface) => {
        return useQuery({
            queryKey: ['extintorReportH'],
            queryFn: () => getExtintorReport(sedeId, from, to, sort, direction),
            refetchOnWindowFocus: false,
        });
    }


export const useExtintorId = (id: number) => {
    return useQuery({
        queryKey: ["extintor", id],
        queryFn: () => getExtintorById(id),
        refetchOnWindowFocus: false,
    });
}