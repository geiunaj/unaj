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
    id: number;
    tipoActivoId: number;
    periodoCalculoId: number;
    sedeId: number;
    pesoTotal: number;
    totalGEI: number;
    tipoActivo: string;
    categoria: string;
    grupo: string;
    proceso: string;
    unidad: string;
}
