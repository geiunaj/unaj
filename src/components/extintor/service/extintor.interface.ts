export interface CreateExtintorProps {
    onClose: () => void;
}


export interface UpdateExtintorProps {
    id: number;
    onClose: () => void;
}

// PARA EL INDEX
export interface ExtintorCollectionItem {
    rn: number;
    id: number;
    consumo: string;
    mes: string;
    anio: string;
    sede: string;
    anio_mes: number;
    anio_id: number;
    sede_id: number;
    mes_id: number;
}

export interface ExtintorCollection {
    data: ExtintorCollectionItem[];
    meta: Meta;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}


// PARA EL SHOW
export interface ExtintorResource {
    rn: number;
    id: number;
    consumo: string;
    mes: string;
    anio: string;
    sede: string;
    anio_mes: number;
    anio_id: number;
    sede_id: number;
    mes_id: number;
}


// PARA EL STORE Y UPDATE
export interface ExtintorRequest {
    consumo: number;
    sede_id: number;
    anio_id: number;
    mes_id: number;
    created_at?: Date;
    updated_at?: Date;
}
