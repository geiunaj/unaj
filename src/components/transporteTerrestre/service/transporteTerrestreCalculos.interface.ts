export interface transporteTerrestreCalcRequest {
    sedeId: number;
    from: string;
    to: string;
}

export interface transporteTerrestreCalculoRequest {
    consumoArea: number;
    factorEmision: number;
    totalGEI: number;
    areaId: number;
    periodoCalculoId: number;
}

export interface transporteTerrestreCalculosCollection {
    data: transporteTerrestreCalculosCollectionItem[];
    meta: Meta;
}

export interface transporteTerrestreCalculosCollectionItem {
    id: number;
    consumo: number;
    totalGEI: number;
    sedeId: number;
    periodoCalculoId: number;
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
