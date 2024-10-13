export interface transporteAereoCalcRequest {
    sedeId: number;
    from: string;
    to: string;
}

export interface transporteAereoCalculoRequest {
    consumoArea: number;
    factorEmision: number;
    totalGEI: number;
    areaId: number;
    periodoCalculoId: number;
}

export interface transporteAereoCalculosCollection {
    data: transporteAereoCalculosCollectionItem[];
    meta: Meta;
}

export interface transporteAereoCalculosCollectionItem {
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
