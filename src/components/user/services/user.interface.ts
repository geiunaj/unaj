import { Sede } from "@/components/sede/services/sede.interface";

export interface User {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    password: string;
    type_user_id: number;
    type_user: TypeUser;
}

export interface UserCollectionItem {
    id: number;
    name: string;
    email: string;
    telefono: string;
    password: string;
    type_user_id: number;
    type_user: TypeUser;
    sede_id: number;
    sede: Sede;
}

export interface TypeUser {
    id: number;
    type_name: string;
}

export interface UserRequest {
    nombre: string;
    email: string;
    telefono: string;
    password: string;
    type_user: string;
}

export interface CreateUserProps {
    onClose: () => void;
}

export interface UpdateUserProps {
    id: number;
    onClose: () => void;
}

export interface TypeUser {
    id: number;
    type_name: string;
}

export interface UserCollection {
    data: UserCollectionItem[];
    meta: Meta;
}


export interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}