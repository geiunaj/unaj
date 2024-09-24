export interface CreateRefrigeranteProps {
    onClose: () => void;
}

export interface UpdateRefrigeranteProps {
    id: number;
    onClose: () => void;
}

//PARA EL INDEX
export interface RefrigeranteCollection {
    data: RefrigeranteCollectionItem[];
    meta: Meta;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface RefrigeranteCollectionItem {
    id: number;
    cantidad: number;
    is_ficha: string;
    ficha_id: number;
    anio: number;
    sede: string;
    clase: string;
    tipoRefrigerante: string;
    porcentajeNit: number;
    rn: number;
}

//PARA EL SHOW
export interface RefrigeranteResource {
    id: number;
    tipoRefrigerante_id: number;
    cantidad: number;
    is_ficha: boolean;
    ficha_id: number;
    sede_id: number;
    anio_id: number;
    created_at: Date;
    updated_at: Date;
    tipoRefrigerante: TipoRefrigerante;
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

export interface TipoRefrigerante {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface RefrigeranteRequest {
    tipoRefrigerante_id: number;
    cantidad: number;
    is_ficha?: boolean;
    ficha_id?: number;
    sede_id: number;
    anio_id: number;
}
