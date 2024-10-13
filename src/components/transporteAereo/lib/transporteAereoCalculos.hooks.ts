import {useQuery} from "@tanstack/react-query";
import {
    getTransporteAereoCalculos,
    getTransporteAereoCalculosReport
} from "@/components/transporteAereo/service/transporteAereoCalculos.actions";

interface getTransporteAereoCalculoInterface {
    from?: string;
    to?: string;
    page?: number;
}

export const useTransporteAereoCalculos =
    ({from, to, page}: getTransporteAereoCalculoInterface) => {
        return useQuery({
            queryKey: ['transporteAereoCalculos'],
            queryFn: () => getTransporteAereoCalculos({
                from, to, page,
            }),
            refetchOnWindowFocus: false,
        });
    }

export const useTransporteAereoCalculosReport =
    ({from, to}: getTransporteAereoCalculoInterface) => {
        return useQuery({
            queryKey: ['transporteAereoCalculosReport'],
            queryFn: () => getTransporteAereoCalculosReport({
                from, to,
            }),
            refetchOnWindowFocus: false,
        });
    }
