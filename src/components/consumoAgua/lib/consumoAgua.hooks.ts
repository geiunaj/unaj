import { useQuery } from "@tanstack/react-query";
import { getAnio } from "@/components/anio/services/anio.actions";
import { getMes } from "@/components/mes/services/mes.actions";
import { getArea } from "@/components/area/services/area.actions";
import { getConsumoAgua } from "../services/consumoAgua.actions";

interface getConsumoAguaInterface {
  // sedeId?: number;
  anioId?: number;
  areaId?: number;
  sort?: string;
  mesId?: number;
  direction?: string;
  page?: number;
}

export const useConsumoAgua = ({
  anioId,
  mesId,
  areaId,
  sort,
  direction,
  page,
}: getConsumoAguaInterface) => {
  return useQuery({
    queryKey: ["ConsumoAgua"],
    queryFn: () => getConsumoAgua(anioId, areaId, sort, mesId, direction, page),
    refetchOnWindowFocus: false,
  });
};

// export const useSede = () => {
//     return useQuery({
//         queryKey: ['sede'],
//         queryFn: () => getSedes(),
//         refetchOnWindowFocus: false,
//     });
// }

export const useAnio = () => {
  return useQuery({
    queryKey: ["anio"],
    queryFn: () => getAnio(),
    refetchOnWindowFocus: false,
  });
};

export const useMes = () => {
  return useQuery({
    queryKey: ["mes"],
    queryFn: () => getMes(),
    refetchOnWindowFocus: false,
  });
};

export const useArea = (sedeId: number) => {
  return useQuery({
    queryKey: ["area"],
    queryFn: () => getArea(sedeId),
    refetchOnWindowFocus: false,
  });
};
