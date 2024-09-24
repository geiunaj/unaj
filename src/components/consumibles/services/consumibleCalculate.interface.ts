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
    consumo: number;
    tipoConsumible: string;
    unidad: string;
    clase: string;
    porcentajeNitrogeno: number;
    cantidadAporte: number;
    emisionDirecta: number;
    totalEmisionesDirectas: number;
    emisionGEI: number;
}
