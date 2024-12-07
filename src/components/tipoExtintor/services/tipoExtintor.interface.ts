export interface TipoExtintor {
    id: number;
    nombre: string;
}

export interface TipoExtintorCollectionItem {
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

export interface TipoExtintorCollectionPaginate {
    data: TipoExtintorCollectionItem[];
    meta: Meta;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface TipoExtintorCollection {
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

export interface TipoExtintorResource {
    id: number;
    nombre: string;
    unidad: string;
    categoria: string;
    categoriaId: number;
    peso: number;
    fuente: string;
    costoUnitario: number;
}

export interface TipoExtintorRequest {
    nombre: string;
}

export interface CreateTipoExtintorProps {
    onClose: () => void;
}

export interface UpdateTipoExtintorProps {
    onClose: () => void;
    id: number;
}
