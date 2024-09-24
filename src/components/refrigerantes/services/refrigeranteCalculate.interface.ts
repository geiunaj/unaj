export interface RefrigeranteCalculosCollection {
    data: RefrigeranteCalcResponse[];
    meta: Meta;
}

interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}


export interface RefrigeranteCalc {
    tipoRefrigeranteId: number;
    consumoTotal: number;
    cantidadAporte: number;
    emisionDirecta: number;
    totalEmisionesDirectas: number;
    emisionGEI: number;
    // anioId: number;
    sedeId: number;
    periodoCalculoId: number;
}

export interface RefrigeranteCalcRequest {
    sedeId: number;
    from: string;
    to: string;
}

export interface RefrigeranteCalcResponse {
    id: number;
    consumo: number;
    tipoRefrigerante: string;
    unidad: string;
    clase: string;
    porcentajeNitrogeno: number;
    cantidadAporte: number;
    emisionDirecta: number;
    totalEmisionesDirectas: number;
    emisionGEI: number;
}
