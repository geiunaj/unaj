import {TipoCombustibleFactorCollection} from "@/components/tipoCombustible/services/tipoCombustibleFactor.interface";

export interface TipoConsumible {
    id: number;
    nombre: string;
    unidad: string;
    descripcionId: number;
    categoriaId: number;
    grupoId: number;
    procesoId: number;
    descripcion: string;
    categoria: string;
    grupo: string;
    proceso: string;
}

export interface TipoConsumibleCollectionItem {
    id: number;
    nombre: string;
    unidad: string;
    descripcionId: number;
    categoriaId: number;
    grupoId: number;
    procesoId: number;
    descripcion: string;
    categoria: string;
    grupo: string;
    proceso: string;
    rn: number;
}

export interface TipoConsumibleCollectionPaginate {
    data: TipoConsumibleCollectionItem[];
    meta: Meta
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface TipoConsumibleCollection {
    id: number;
    nombre: string;
    unidad: string;
    descripcionId: number;
    categoriaId: number;
    grupoId: number;
    procesoId: number;
    descripcion: string;
    categoria: string;
    grupo: string;
    proceso: string;
}

export interface TipoConsumibleResource {
    id: number;
    nombre: string;
    unidad: string;
    descripcionId: number;
    categoriaId: number;
    grupoId: number;
    procesoId: number;
    descripcion: string;
    categoria: string;
    grupo: string;
    proceso: string;
}

export interface TipoConsumibleRequest {
    nombre: string;
    unidad: string;
    descripcionId: number;
    categoriaId: number;
    grupoId: number;
    procesoId: number;
}

export interface CreateTipoConsumibleProps {
    onClose: () => void;
}

export interface UpdateTipoConsumibleProps {
    onClose: () => void;
    id: number;
}
