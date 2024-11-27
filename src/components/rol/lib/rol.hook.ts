import {useQuery} from "@tanstack/react-query";
import {getRol} from "../services/rol.actions";

export const useRol = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: () => getRol(),
        refetchOnWindowFocus: false,
    });
};
