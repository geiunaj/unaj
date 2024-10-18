import {useQuery} from "@tanstack/react-query";
import {
    getTransporteTerrestreCalculos,
    getTransporteTerrestreCalculosReport
} from "@/components/transporteTerrestre/service/transporteTerrestreCalculos.actions";

interface getTransporteTerrestreCalculoInterface {
    from?: string;
    to?: string;
    page?: number;
}

export const useTransporteTerrestreCalculos =
    ({from, to, page}: getTransporteTerrestreCalculoInterface) => {
        return useQuery({
            queryKey: ['transporteTerrestreCalculos'],
            queryFn: () => getTransporteTerrestreCalculos({
                from, to, page
            }),
            refetchOnWindowFocus: false,
        });
    }

export const useTransporteTerrestreCalculosReport =
    ({from, to}: getTransporteTerrestreCalculoInterface) => {
        return useQuery({
            queryKey: ['transporteTerrestreCalculosReport'],
            queryFn: () => getTransporteTerrestreCalculosReport({
                from, to
            }),
            refetchOnWindowFocus: false,
        });
    }
