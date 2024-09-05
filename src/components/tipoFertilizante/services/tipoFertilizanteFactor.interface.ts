export interface TipoFertilizanteFactor {
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

export interface TipoFertilizanteFactorCollection {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export interface TipoFertilizanteFactorResource {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
}


export interface TipoFertilizanteFactorRequest {
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    clase: string;
}

export interface CreateTipoFertilizanteFactorProps {
    onClose: () => void;
}

export interface UpdateTipoFertilizanteFactorProps {
    onClose: () => void;
    id: number;
}
