export interface Anio {
    id: number;
    nombre: string;
}

export interface AnioRequest {
    nombre: string;
}

export interface AnioCollection {
    data: Anio[];
    meta: Meta;
}

export interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface CreateAnioProps {
    onClose: () => void;
}

export interface UpdateAnioProps {
    id: number;
    onClose: () => void;
}
