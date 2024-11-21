export interface TipoVehiculo {
    id: number;
    nombre: string;
}

export interface TipoVehiculoCollectionItem {
    rn: number;
    id: number;
    nombre: string;
    unidad: string;
    categoria: string;
    categoriaId: number;
    peso: number;
    fuente: string;
    costoUnitario: number;
}

export interface TipoVehiculoCollectionPaginate {
    data: TipoVehiculoCollectionItem[];
    meta: Meta;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface TipoVehiculoCollection {
    id: number;
    nombre: string;
    unidad: string;
    descripcionId: number;
    categoriaId: number;
    grupoId: number;
    procesoId: number;
    descripcion: string;
    categoria: string;
    grupo: string;
    proceso: string;
}

export interface TipoVehiculoResource {
    id: number;
    nombre: string;
    unidad: string;
    categoria: string;
    categoriaId: number;
    peso: number;
    fuente: string;
    costoUnitario: number;
}

export interface TipoVehiculoRequest {
    nombre: string;
}

export interface CreateTipoVehiculoProps {
    onClose: () => void;
}

export interface UpdateTipoVehiculoProps {
    onClose: () => void;
    id: number;
}
