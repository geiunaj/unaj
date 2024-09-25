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
    nombre: string;
    valor: number;
    anio_id: number;
    anio: string;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface DescripcionConsumibleResource {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
}


export interface CreateDescripcionConsumibleProps {
    onClose: () => void;
}

export interface UpdateDescripcionConsumibleProps {
    onClose: () => void;
    id: number;
}
