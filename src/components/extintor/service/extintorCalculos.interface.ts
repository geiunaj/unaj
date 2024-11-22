export interface ExtintorCalcRequest {
    sedeId: number;
    from: string;
    to: string;
}

export interface ExtintorCalculoRequest {
    consumoArea: number;
    factorEmision: number;
    totalGEI: number;
    areaId: number;
    periodoCalculoId: number;
}

export interface ExtintorCalculosCollection {
    data: ExtintorCalculosCollectionItem[];
    meta: Meta;
}

export interface ExtintorCalculosCollectionItem {
    rn: number;
    id: number;
    sedeId: number;
    periodoCalculoId: number;
    consumoTotal: number;
    totalGEI: number;
    sede: string;
    factoresEmision: FactoresEmision[];
    factoresEmisionString: string;
}

export interface FactoresEmision {
    anio: string;
    factor: number;
}

export interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}
