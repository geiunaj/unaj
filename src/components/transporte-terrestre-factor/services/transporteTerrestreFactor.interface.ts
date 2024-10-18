export interface TransporteTerrestreFactor {
    id: number;
    factor: number;
    anio_id: number;
    anio: string;
}

export interface TransporteTerrestreFactorRequest {
    factor: number;
    anioId: number;
}

interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

export interface TransporteTerrestreFactorCollectionPaginate {
    data: TransporteTerrestreFactorCollection[];
    meta: Meta;
}

export interface TransporteTerrestreFactorCollection {
    id: number;
    factor: number;
    anio_id: number;
    anio: string;
}

export interface CreateTransporteTerrestreFactorProps {
    onClose: () => void;
}

export interface UpdateTransporteTerrestreFactorProps {
    onClose: () => void;
    id: number;
}
