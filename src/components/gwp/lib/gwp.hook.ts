import {useQuery} from "@tanstack/react-query";
import { getGPW } from "../services/gwp.actions";


export const useGPW = () => {
    return useQuery({
        queryKey: ['GPW'],
        queryFn: () => getGPW(),
        refetchOnWindowFocus: false,
    });
}
