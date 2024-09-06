export interface ConsumoPapelRequest {
    tipoPapel_id: number;
    cantidad_paquete: number;
    sede_id: number;
    anio_id: number;
    comentario?: string;
}

export interface ConsumoPapelResource {
    id: number;
    tipoPapel_id: number;
    cantidad_paquete: number;
    comentario: string;
    anio_id: number;
    sede_id: number;
    created_at: Date;
    updated_at: Date;
    tipoPapel: TipoPapel;
    sede: Sede;
    anio: Anio;
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

export interface TipoPapel {
    id: number;
    nombre: string;
    gramaje: number;
    unidad_paquete: string;
    is_certificado: boolean;
    is_reciclable: boolean;
    porcentaje_reciclado: number;
    nombre_certificado: string;
    created_at: Date;
    updated_at: Date;
}


export interface CollectionConsumoPapel {
    data: ConsumoPapelCollectionItem[];
    meta: Meta;
}

export interface ConsumoPapelCollectionItem {
    id: number;
    nombre: string;
    cantidad_paquete: number;
    comentario: null;
    anio_id: number;
    sede_id: number;
    gramaje: number;
    unidad_paquete: string;
    porcentaje_reciclado: number;
    nombre_certificado: string;
    anio: string;
    sede: string;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface CreateConsumoPapelProps {
    onClose: () => void;
}

export interface UpdateConsumoPapelProps {
    onClose: () => void;
    id: number;
}
