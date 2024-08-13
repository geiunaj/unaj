export interface tipoPapel {
    id: number;
    nombre: string;
    gramaje: number;
    unidad_paquete: string;
    is_certificado?: boolean;
    is_reciclable?: boolean;
    porcentaje_reciclado?: number;
    nombre_certificado?: string;
    created_at: Date;
    updated_at: Date;
    // comentario: string;
}

export interface TipoPapelCollection {
    id: number;
    nombre: string;
    gramaje: number;
    unidad_paquete: string;
    is_certificado?: boolean;
    is_reciclable?: boolean;
    porcentaje_reciclado: number;
    nombre_certificado?: string;
    nombreFiltro: string;
}

export interface TipoPapelRequest {
    nombre: string;
    gramaje: number;
    unidad_paquete: string;
    is_certificado?: boolean;
    is_reciclable?: boolean;
    porcentaje_reciclado?: number;
    nombre_certificado?: string;
}

export interface CreateTipoPapelProps {
    onClose: () => void;
}

export interface UpdateTipoPapelProps {
    onClose: () => void;
    id: number;
}