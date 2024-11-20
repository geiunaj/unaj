export interface CreateActivoProps {
    onClose: () => void;
}

export interface UpdateActivoProps {
    id: number;
    onClose: () => void;
}

//PARA EL INDEX
export interface ActivoCollection {
    data: ActivoCollectionItem[];
    meta: Meta;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface ActivoCollectionItem {
    rn: number;
    id: number;
    tipoActivoId: number;
    sedeId: number;
    anioId: number;
    mesId: number;
    anio_mes: number;
    cantidadComprada: number;
    cantidadConsumida: number;
    costoTotal: string;
    consumoTotal: string;
    tipoActivo: string;
    categoria: string;
    unidad: string;
    mes: string;
    anio: string;
    sede: string;
}

//PARA EL SHOW
export interface ActivoResource {
    id: number;
    tipoActivoId: number;
    sedeId: number;
    anioId: number;
    mesId: number;
    anio_mes: number;
    pesoTotal: number;
    tipoActivo: string;
    categoria: string;
    grupo: string;
    proceso: string;
    unidad: string;
    mes: string;
    anio: string;
    sede: string;
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

export interface TipoActivo {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface ActivoRequest {
    tipoActivoId: number;
    sedeId: number;
    anioId: number;
    mesId: number;
    cantidadComprada: number;
    cantidadConsumida: number;
}
