import { useQuery } from "@tanstack/react-query";
import { getTaxi, getTaxiById } from "../service/taxi.actions";

export const useTaxi = (selectedSede: string, anio: string, mesId: string) => {
  return useQuery({
    queryKey: ["taxi"],
    queryFn: () => getTaxi(selectedSede, anio, mesId),
    refetchOnWindowFocus: false,
  });
};


export const useTaxiId = (id: number) => {
  return useQuery({
      queryKey: ["taxi", id],
      queryFn: () => getTaxiById(id),
      refetchOnWindowFocus: false,
  });
}