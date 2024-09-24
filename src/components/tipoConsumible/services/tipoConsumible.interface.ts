export interface TipoConsumible {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    created_at: Date;
    updated_at: Date;
}

export interface ClaseConsumible {
    nombre: string;
}

export interface TipoConsumibleCollection {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface TipoConsumibleResource {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
}


export interface TipoConsumibleRequest {
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    clase: string;
}

export interface CreateTipoConsumibleProps {
    onClose: () => void;
}

export interface UpdateTipoConsumibleProps {
    onClose: () => void;
    id: number;
}
