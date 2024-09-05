export interface CreateFertilizanteProps {
    onClose: () => void;
}

export interface UpdateFertilizanteProps {
    id: number;
    onClose: () => void;
}

//PARA EL INDEX
export interface fertilizanteCollection {
    data: fertilizanteCollectionItem[];
    meta: Meta;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface fertilizanteCollectionItem {
    id: number;
    cantidad: number;
    is_ficha: string;
    ficha_id: number;
    anio: number;
    sede: string;
    clase: string;
    tipoFertilizante: string;
    porcentajeNit: number;
    rn: number;
}

//PARA EL SHOW
export interface fertilizanteResource {
    id: number;
    tipoFertilizante_id: number;
    cantidad: number;
    is_ficha: boolean;
    ficha_id: number;
    sede_id: number;
    anio_id: number;
    created_at: Date;
    updated_at: Date;
    tipoFertilizante: TipoFertilizante;
    anio: Anio;
    sede: Sede;
}

export interface Anio {
    id: number;
    nombre: string;
    created_at: Date;
    updated_at: Date;
}

export interface Sede {
    id: number;
    name: string;
}

export interface TipoFertilizante {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface FertilizanteRequest {
    tipoFertilizante_id: number;
    cantidad: number;
    is_ficha?: boolean;
    ficha_id?: number;
    sede_id: number;
    anio_id: number;
}
