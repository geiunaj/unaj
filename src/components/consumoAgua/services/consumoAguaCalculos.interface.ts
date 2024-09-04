export interface consumoAguaCalcRequest {
    sedeId: number;
    from: string;
    to: string;
}

export interface consumoAguaCalculoRequest {
    consumoArea: number;
    factorEmision: number;
    totalGEI: number;
    areaId: number;
    periodoCalculoId: number;
}

export interface consumoAguaCalculosCollection {
    data: consumoAguaCalculosCollectionItem[];
    meta: Meta;
}

export interface consumoAguaCalculosCollectionItem {
    areaId: number;
    periodoCalculoId: number;
    id: number;
    consumoArea: number;
    totalGEI: number;
    area: string;
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
