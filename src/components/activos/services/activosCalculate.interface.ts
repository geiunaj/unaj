export interface ActivoCalculosCollection {
    data: ActivoCalcResponse[];
    meta: Meta;
}

interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface ActivoCalc {
    tipoActivoId: number;
    consumoTotal: number;
    cantidadAporte: number;
    emisionDirecta: number;
    totalEmisionesDirectas: number;
    emisionGEI: number;
    // anioId: number;
    sedeId: number;
    periodoCalculoId: number;
}

export interface ActivoCalcRequest {
    sedeId: number;
    from: string;
    to: string;
}

export interface ActivoCalcResponse {
    rn: number;
    id: number;
    grupoActivoId: number;
    periodoCalculoId: number;
    sedeId: number;
    cantidadTotal: string;
    totalGEI: string;
    grupoActivo: string;
    sede: string;
    factoresEmision: FactoresEmision[];
    factoresEmisionString: string;
}

export interface FactoresEmision {
    anio: string;
    factor: number;
}
