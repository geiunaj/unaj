export interface tipoPapel {
    id: number;
    nombre: string;
    area: number
    gramaje: number;
    hojas: number;
    created_at: Date;
    updated_at: Date;
    // comentario: string;
}

export interface TipoPapelCollection {
    id: number;
    nombre: string;
    area: number;
    gramaje: number;
    hojas: number;
    nombreFiltro: string;
}

export interface TipoPapelRequest {
    nombre: string;
    area: number;
    gramaje: number;
    hojas: number;
}

export interface CreateTipoPapelProps {
    onClose: () => void;
}

export interface UpdateTipoPapelProps {
    onClose: () => void;
    id: number;
}