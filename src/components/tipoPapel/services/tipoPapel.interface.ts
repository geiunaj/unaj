export interface tipoPapel{
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