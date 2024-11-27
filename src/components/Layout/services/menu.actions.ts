import api from "../../../../config/api";
import {AxiosRequestConfig} from "axios";

interface GetPermisos {
    id: number;
}

export async function getPermisos(
    {id}: GetPermisos
): Promise<any> {
    const config: AxiosRequestConfig = {
        params: {id}
    }
    const {data} = await api.get<any>("/api/auth/permisos", config);
    return data;
}