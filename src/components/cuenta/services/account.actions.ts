import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {PasswordRequest, ProfileRequest} from "@/components/cuenta/services/account.interface";

interface Response {
    message: string;
}

export interface ExtintorFactorIndex {
    anioId?: string;
    page?: number;
    perPage?: number;
}

// export async function getExtintorFactorPaginate(
//     {
//         anioId,
//         page = 1,
//         perPage = 10
//     }: ExtintorFactorIndex
// ): Promise<ExtintorFactorCollectionPaginate> {
//     const config: AxiosRequestConfig = {
//         params: {
//             anioId,
//             page,
//             perPage
//         }
//     }
//     const {data} = await api.get<ExtintorFactorCollectionPaginate>("/api/extintor/factor", config);
//     return data;
// }
export async function updatePassword(id: number, passwordRequest: PasswordRequest): Promise<AxiosResponse<Response>> {
    return await api.post(`/api/account/${id}`, passwordRequest);
}

export async function updateProfile(id: number, profileRequest: ProfileRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/account/${id}`, profileRequest);
}
