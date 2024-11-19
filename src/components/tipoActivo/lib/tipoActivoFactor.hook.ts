import { useQuery } from "@tanstack/react-query";
import { getFactorEmisionActivoPage } from "@/components/tipoActivo/services/tipoActivoFactor.actions";
import { getAnio } from "@/components/anio/services/anio.actions";
import { getTiposActivo } from "../services/tipoActivo.actions";

export interface FactorEmisionActivoIndex {
  tipoActivoId?: string;
  anioId?: string;
  page?: number;
  perPage?: number;
}

export const useAnio = () => {
  return useQuery({
    queryKey: ["anioTCSF"],
    queryFn: () => getAnio(),
    refetchOnWindowFocus: false,
  });
};

export const useTipoActivo = () => {
  return useQuery({
    queryKey: ["tipoActivoF"],
    queryFn: () => getTiposActivo(),
    refetchOnWindowFocus: false,
  });
};

export const useActivoFactor = ({
  tipoActivoId,
  anioId,
  page,
  perPage,
}: FactorEmisionActivoIndex) => {
  return useQuery({
    queryKey: ["factorEmisionActivo"],
    queryFn: () =>
      getFactorEmisionActivoPage({
        tipoActivoId,
        anioId,
        page,
        perPage,
      }),
    refetchOnWindowFocus: false,
  });
};
