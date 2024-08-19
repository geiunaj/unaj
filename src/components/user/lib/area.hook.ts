import {useQuery} from "@tanstack/react-query";
import { getUser } from "../services/user.actions";

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
        refetchOnWindowFocus: false,
    });
}