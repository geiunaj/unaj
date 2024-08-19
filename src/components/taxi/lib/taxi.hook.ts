import { useQuery } from "@tanstack/react-query";
import { getTaxi } from "../service/taxi.actions";

export const useTaxi = (selectedSede: string, anio: string, mesId: string) => {
  return useQuery({
    queryKey: ["consumoPapelQuery"],
    queryFn: () => getTaxi(selectedSede, anio, mesId),
    refetchOnWindowFocus: false,
  });
};
