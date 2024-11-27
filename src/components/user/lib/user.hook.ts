import {useQuery} from "@tanstack/react-query";
import {getUser} from "../services/user.actions";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getRol} from "@/components/rol/services/rol.actions";

export interface getUserInterface {
    sedeId?: number;
    page?: number;
    type_user_id?: number;
}

export const useUser = ({sedeId, type_user_id, page}: getUserInterface) => {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => getUser({sedeId, type_user_id, page}),
        refetchOnWindowFocus: false,
    });
};

export const useSede = () => {
    return useQuery({
        queryKey: ['sedeForUser'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
}
export const useRol = () => {
    return useQuery({
        queryKey: ['rolForUser'],
        queryFn: () => getRol(),
        refetchOnWindowFocus: false,
    });
}
