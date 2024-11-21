export interface VehiculoFactor {
    id: number;
    nombre: string;
    valor: number;
    created_at: Date;
    updated_at: Date;
}

export interface VehiculoFactorRequest {
    factorCO2?: number;
    factorCH4?: number;
    factorN2O?: number;
    factor: number;
    tipoVehiculoId: number;
    anioId: number;
    fuente?: string;
    link?: string;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface VehiculoFactorCollectionPaginate {
    data: VehiculoFactorCollection[];
    meta: Meta;
}

export interface VehiculoFactorCollection {
    id: number;
    factor: number;
    tipoVehiculoId: number;
    anioId: number;
    fuente: string;
    link: string;
    anio: string;
    tipoVehiculo: string;
}

export interface VehiculoFactorResource {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
}

export interface CreateVehiculoFactorProps {
    onClose: () => void;
}

export interface UpdateVehiculoFactorProps {
    onClose: () => void;
    id: number;
}
