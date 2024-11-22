import {useQuery} from "@tanstack/react-query";
import {
    getExtintorCalculos,
    getExtintorCalculosReport
} from "@/components/extintor/service/extintorCalculos.actions";

interface getExtintorCalculoInterface {
    from?: string;
    to?: string;
    page?: number;
}

export const useExtintorCalculos =
    ({from, to, page}: getExtintorCalculoInterface) => {
        return useQuery({
            queryKey: ['extintorCalculos'],
            queryFn: () => getExtintorCalculos({
                from, to, page
            }),
            refetchOnWindowFocus: false,
        });
    }

export const useExtintorCalculosReport =
    ({from, to}: getExtintorCalculoInterface) => {
        return useQuery({
            queryKey: ['extintorCalculosReport'],
            queryFn: () => getExtintorCalculosReport({
                from, to
            }),
            refetchOnWindowFocus: false,
        });
    }
