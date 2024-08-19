import { User } from "@prisma/client";
import api from "../../../../config/api";
import {AxiosResponse} from "axios";
import { UserRequest } from "./user.interface";

interface Response {
    message: string;
}

export async function getUser(): Promise<User[]> {
    const {data} = await api.get<User[]>("/api/user");
    return data;
}

export async function getUserById(id: number): Promise<User> {
    const {data} = await api.get<User>(`/api/user/${id}`);
    return data;
}

export async function createUser(User: UserRequest): Promise<AxiosResponse<Response>> {
    return await api.post("/api/user", User);
}

export async function updateUser(id: number, User: UserRequest): Promise<AxiosResponse<Response>> {
    return await api.put(`/api/user/${id}`, User);
}

export async function deleteUser(id: number): Promise<AxiosResponse<Response>> {
    return await api.delete(`/api/user/${id}`);
}