export interface DescripcionConsumible {
    id: number;
    descripcion: string;
    created_at: Date;
    updated_at: Date;
}

export interface DescripcionConsumibleRequest {
    descripcion: string;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface DescripcionConsumibleCollectionPaginate {
    data: DescripcionConsumibleCollection[];
    meta: Meta
}

export interface DescripcionConsumibleCollection {
    id: number;
    descripcion: string;
    rn: number;
}

export interface DescripcionConsumibleResource {
    id: number;
    descripcion: string;
}


export interface CreateDescripcionConsumibleProps {
    onClose: () => void;
}

export interface UpdateDescripcionConsumibleProps {
    onClose: () => void;
    id: number;
}
