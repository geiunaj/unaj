export interface CreateTransporteCasaTrabajoProps {
    onClose: () => void;
}

export interface UpdateTransporteCasaTrabajoProps {
    id: number;
    onClose: () => void;
}

//PARA EL INDEX
export interface TransporteCasaTrabajoCollection {
    data: TransporteCasaTrabajoCollectionItem[];
    meta: Meta;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface TransporteCasaTrabajoCollectionItem {
    rn: number;
    id: number;
    tipo: string;
    tipoVehiculoId: number;
    kmRecorrido: number;
    sedeId: number;
    anioId: number;
    mesId: number;
    anio_mes: number;
    tipoVehiculo: string;
    mes: string;
    anio: string;
    sede: string;
}

//PARA EL SHOW
export interface TransporteCasaTrabajoResource {
    id: number;
    tipo: string;
    tipoVehiculoId: number;
    kmRecorrido: number;
    sedeId: number;
    anioId: number;
    mesId: number;
    anio_mes: number;
    tipoVehiculo: string;
    mes: string;
    anio: string;
    sede: string;
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

export interface TipoTransporteCasaTrabajo {
    id: number;
    clase: string;
    nombre: string;
    porcentajeNitrogeno: number;
    unidad: string;
    created_at: Date;
    updated_at: Date;
}

export type TipoCasaTrabajo = "ALUMNO" | "DOCENTE" | "ADMINISTRATIVO" | "";

export interface TransporteCasaTrabajoRequest {
    tipo: TipoCasaTrabajo | string;
    tipoVehiculoId: number;
    kmRecorrido: number;
    sedeId: number;
    anioId: number;
    mesId: number;
}
