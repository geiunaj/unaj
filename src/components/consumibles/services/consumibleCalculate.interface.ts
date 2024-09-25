export interface ConsumibleCalculosCollection {
    data: ConsumibleCalcResponse[];
    meta: Meta;
}

interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface ConsumibleCalc {
    tipoConsumibleId: number;
    consumoTotal: number;
    cantidadAporte: number;
    emisionDirecta: number;
    totalEmisionesDirectas: number;
    emisionGEI: number;
    // anioId: number;
    sedeId: number;
    periodoCalculoId: number;
}

export interface ConsumibleCalcRequest {
    sedeId: number;
    from: string;
    to: string;
}

export interface ConsumibleCalcResponse {
    id: number;
    tipoConsumibleId: number;
    periodoCalculoId: number;
    sedeId: number;
    pesoTotal: number;
    totalGEI: number;
    tipoConsumible: string;
    categoria: string;
    grupo: string;
    proceso: string;
    unidad: string;
}
