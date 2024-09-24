export interface CreateConsumibleProps {
    onClose: () => void;
}

export interface UpdateConsumibleProps {
    id: number;
    onClose: () => void;
}

//PARA EL INDEX
export interface ConsumibleCollection {
    data: ConsumibleCollectionItem[];
    meta: Meta;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface ConsumibleCollectionItem {
    id: number;
    cantidad: number;
    is_ficha: string;
    ficha_id: number;
    anio: number;
    sede: string;
    clase: string;
    tipoConsumible: string;
    porcentajeNit: number;
    rn: number;
}

//PARA EL SHOW
export interface ConsumibleResource {
    id: number;
    tipoConsumible_id: number;
    cantidad: number;
    is_ficha: boolean;
    ficha_id: number;
    sede_id: number;
    anio_id: number;
    created_at: Date;
    updated_at: Date;
    tipoConsumible: TipoConsumible;
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

export interface TipoConsumible {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface ConsumibleRequest {
    tipoConsumible_id: number;
    cantidad: number;
    is_ficha?: boolean;
    ficha_id?: number;
    sede_id: number;
    anio_id: number;
}
