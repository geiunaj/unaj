import {useQuery} from "@tanstack/react-query";
import {
    getExtintorCalculos,
    getExtintorCalculosReport
} from "@/components/extintor/service/extintorCalculos.actions";

interface getExtintorCalculoInterface {
    sedeId?: number;
    from?: string;
    to?: string;
    page?: number;
}

export const useExtintorCalculos =
    ({sedeId, from, to, page}: getExtintorCalculoInterface) => {
        return useQuery({
            queryKey: ['extintorCalculos'],
            queryFn: () => getExtintorCalculos({
                sedeId, from, to, page
            }),
            refetchOnWindowFocus: false,
        });
    }

export const useExtintorCalculosReport =
    ({sedeId, from, to}: getExtintorCalculoInterface) => {
        return useQuery({
            queryKey: ['extintorCalculosReport'],
            queryFn: () => getExtintorCalculosReport({
                sedeId, from, to
            }),
            refetchOnWindowFocus: false,
        });
    }
