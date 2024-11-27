import {User} from "@prisma/client";
import api from "../../../../config/api";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {UserCollection, UserRequest} from "./user.interface";
import {getUserInterface} from "@/components/user/lib/user.hook";

interface Response {
    message: string;
}

export async function getUser(
    {
        sedeId,
        type_user_id,
        page,
    }: getUserInterface
): Promise<UserCollection> {
    const config: AxiosRequestConfig = {
        params: {
            page,
            type_user_id,
            sedeId,
        },
    };
    const {data} = await api.get<UserCollection>("/api/user", config);
    return data;
}

export async function getUserById(id: number): Promise<User> {
    const {data} = await api.get<User>(`/api/user/${id}`);
    return data;
}

export async function createUser(
    User: UserRequest
): Promise<AxiosResponse<Response>> {
    return await api.post("/api/user", User);
}

export async function updateUser(
    id: number,
    User: UserRequest
): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/user/${id}`, User);
}

export async function deleteUser(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/user/${id}`);
}
