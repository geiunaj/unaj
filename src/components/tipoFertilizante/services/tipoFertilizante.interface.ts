export interface TipoFertilizante {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    created_at: Date;
    updated_at: Date;
}

export interface ClaseFertilizante{
    nombre: string;
}

export interface TipoFertilizanteCollection {
    id: number;
    // clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    created_at: Date;
    updated_at: Date;
}