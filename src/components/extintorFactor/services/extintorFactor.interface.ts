export interface ExtintorFactor {
    id: number;
    factor: number;
    anio_id: number;
    anio: string;
}

export interface ExtintorFactorRequest {
    factor: number;
    tipoExtintorId: number;
    anioId: number;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface ExtintorFactorCollectionPaginate {
    data: ExtintorFactorCollection[];
    meta: Meta;
}

export interface ExtintorFactorCollection {
    id: number;
    factor: number;
    tipoExtintorId: number;
    anio_id: number;
    anio: string;
    tipoExtintor: string;
}

export interface CreateExtintorFactorProps {
    onClose: () => void;
}

export interface UpdateExtintorFactorProps {
    onClose: () => void;
    id: number;
}
