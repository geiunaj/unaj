import {Sede} from "@/components/sede/services/sede.interface";

export interface Rol {
    id: number;
    type_name: string;
}

export interface RolById {
    id: number;
    type_name: string;
    permisos: number[];
}

export interface RolCollectionItem {
    id: number;
    type_name: string;
}

export interface TypeRol {
    id: number;
    type_name: string;
}

export interface RolRequest {
    type_name: string;
    permisos: number[];
}

export interface CreateRolProps {
    onClose: () => void;
}

export interface UpdateRolProps {
    id: number;
    onClose: () => void;
}

export interface TypeRol {
    id: number;
    type_name: string;
}

export interface RolCollection {
    data: RolCollectionItem[];
    meta: Meta;
}


export interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}