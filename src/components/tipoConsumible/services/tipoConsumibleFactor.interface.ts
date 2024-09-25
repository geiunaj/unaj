export interface ConsumibleFactor {
    id: number;
    nombre: string;
    valor: number;
    created_at: Date;
    updated_at: Date;
}

export interface ConsumibleFactorRequest {
    nombre: string;
    valor: number;
    anio_id: number;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface ConsumibleFactorCollectionPaginate {
    data: ConsumibleFactorCollection[];
    meta: Meta
}

export interface ConsumibleFactorCollection {
    id: number;
    nombre: string;
    valor: number;
    anio_id: number;
    anio: string;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface ConsumibleFactorResource {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
}


export interface CreateConsumibleFactorProps {
    onClose: () => void;
}

export interface UpdateConsumibleFactorProps {
    onClose: () => void;
    id: number;
}
