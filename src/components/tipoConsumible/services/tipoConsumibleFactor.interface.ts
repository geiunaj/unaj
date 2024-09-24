export interface FertilizanteFactor {
    id: number;
    nombre: string;
    valor: number;
    created_at: Date;
    updated_at: Date;
}

export interface FertilizanteFactorRequest {
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

export interface FertilizanteFactorCollectionPaginate {
    data: FertilizanteFactorCollection[];
    meta: Meta
}

export interface FertilizanteFactorCollection {
    id: number;
    nombre : string;
    valor: number;
    anio_id: number;
    anio: string;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface FertilizanteFactorResource {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
}


export interface CreateFertilizanteFactorProps {
    onClose: () => void;
}

export interface UpdateFertilizanteFactorProps {
    onClose: () => void;
    id: number;
}
