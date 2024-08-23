export interface ConsumoPapelRequest {
    tipoPapel_id: number;
    cantidad_paquete: number;
    sede_id: number;
    anio_id: number;
    comentario?: string;
}

export interface ConsumoPapelResource {
    id: number;
    nombre: string;
    cantidad_paquete: number;
    comentario: null | string;
    anio: string;
    sede: string;
    
}


export interface CollectionConsumoPapel {
    id: number;
    nombre: string;
    cantidad_paquete: number;
    comentario: null | string;
    anio_id: number;
    sede_id: number;
    gramaje: number;
    unidad_paquete: string;
    is_certificado: boolean;
    is_reciclable: boolean;
    porcentaje_reciclado: number;
    nombre_certificado: string;
    anio: string;
    sede: string;
}

export interface CreateConsumoPapelProps {
    onClose: () => void;
}

export interface UpdateConsumoPapelProps {
    onClose: () => void;
    id: number;
}
