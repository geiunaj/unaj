import { useQuery } from "@tanstack/react-query";
import { getTaxi, getTaxiById } from "../service/taxi.actions";

interface getTaxiInterface {
  sedeId?: number;
  anioId?: number;
  mesId?: number;
  sort?: string;
  direction?: string;

  page?: number;
}

export const useTaxi = ({
  sedeId,
  anioId,
  mesId,
  sort,
  direction,
  page,
}: getTaxiInterface) => {
  return useQuery({
    queryKey: ["taxi"],
    queryFn: () => getTaxi(sedeId, anioId, mesId, sort, direction, page),
    refetchOnWindowFocus: false,
  });
}


export const useTaxiId = (id: number) => {
  return useQuery({
      queryKey: ["taxi", id],
      queryFn: () => getTaxiById(id),
      refetchOnWindowFocus: false,
  });
}