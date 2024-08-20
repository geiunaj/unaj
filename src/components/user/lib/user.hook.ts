import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/user.actions";

interface getUserInterface {
  // tipoFertilizanteId?: number;
  sedeId?: number;
  // anio?: string;
  // sort?: string;
  // direction?: string;
  // page?: number;
}

export const useUser = ({ sedeId }: getUserInterface) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(sedeId),
    refetchOnWindowFocus: false,
  });
};
