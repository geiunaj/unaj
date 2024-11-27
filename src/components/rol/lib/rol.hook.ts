import {useQuery} from "@tanstack/react-query";
import {getRolIndex, getRolPaginate} from "../services/rol.actions";

export const useRol = ({perPage, page}: getRolIndex) => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: () => getRolPaginate({perPage, page}),
        refetchOnWindowFocus: false,
    });
};
