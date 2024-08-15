import {useQuery} from "@tanstack/react-query";
import {getArea} from "@/components/area/services/area.actions";

export const useArea = () => {
    return useQuery({
        queryKey: ['area'],
        queryFn: () => getArea(),
        refetchOnWindowFocus: false,
    });
}