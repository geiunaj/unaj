import {useQuery} from "@tanstack/react-query";
import {
    getTaxiCalculos,
    getTaxiCalculosReport
} from "@/components/taxi/service/taxiCalculos.actions";

interface getTaxiCalculoInterface {
    from?: string;
    to?: string;
    page?: number;
}

export const useTaxiCalculos =
    ({from, to, page}: getTaxiCalculoInterface) => {
        return useQuery({
            queryKey: ['taxiCalculos'],
            queryFn: () => getTaxiCalculos({
                from, to, page,
            }),
            refetchOnWindowFocus: false,
        });
    }

export const useTaxiCalculosReport =
    ({from, to}: getTaxiCalculoInterface) => {
        return useQuery({
            queryKey: ['taxiCalculosReport'],
            queryFn: () => getTaxiCalculosReport({
                from, to,
            }),
            refetchOnWindowFocus: false,
        });
    }
