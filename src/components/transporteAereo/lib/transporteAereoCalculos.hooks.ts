import {useQuery} from "@tanstack/react-query";
import {
    getTransporteAereoCalculos,
    getTransporteAereoCalculosReport
} from "@/components/transporteAereo/service/transporteAereoCalculos.actions";

interface getTransporteAereoCalculoInterface {
    from?: string;
    to?: string;
    page?: number;
    sedeId?: number;
}

export const useTransporteAereoCalculos =
    ({from, to, sedeId, page}: getTransporteAereoCalculoInterface) => {
        return useQuery({
            queryKey: ['transporteAereoCalculos'],
            queryFn: () => getTransporteAereoCalculos({
                from, to, sedeId, page
            }),
            refetchOnWindowFocus: false,
        });
    }

export const useTransporteAereoCalculosReport =
    ({from, to, sedeId}: getTransporteAereoCalculoInterface) => {
        return useQuery({
            queryKey: ['transporteAereoCalculosReport'],
            queryFn: () => getTransporteAereoCalculosReport({
                from, to, sedeId
            }),
            refetchOnWindowFocus: false,
        });
    }
