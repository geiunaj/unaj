export interface GrupoConsumible {
    id: number;
    nombre: string;
    created_at: Date;
    updated_at: Date;
}

export interface GrupoConsumibleRequest {
    nombre: string;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface GrupoConsumibleCollectionPaginate {
    data: GrupoConsumibleCollection[];
    meta: Meta
}

export interface GrupoConsumibleCollection {
    id: number;
    nombre: string;
    valor: number;
    anio_id: number;
    anio: string;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface GrupoConsumibleResource {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
}


export interface CreateGrupoConsumibleProps {
    onClose: () => void;
}

export interface UpdateGrupoConsumibleProps {
    onClose: () => void;
    id: number;
}
