export interface TipoFertilizante {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    created_at: Date;
    updated_at: Date;
}

export interface ClaseFertilizante {
    nombre: string;
}

export interface TipoFertilizanteCollection {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface TipoFertilizanteResource {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
}


export interface TipoFertilizanteRequest {
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    clase: string;
}

export interface CreateTipoFertilizanteProps {
    onClose: () => void;
}

export interface UpdateTipoFertilizanteProps {
    onClose: () => void;
    id: number;
}
