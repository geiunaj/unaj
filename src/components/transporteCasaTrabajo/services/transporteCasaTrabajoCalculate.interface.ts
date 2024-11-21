export interface TransporteCasaTrabajoCalculosCollection {
    data: TransporteCasaTrabajoCalcResponse[];
    meta: Meta;
}

interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface TransporteCasaTrabajoCalc {
    tipoTransporteCasaTrabajoId: number;
    consumoTotal: number;
    cantidadAporte: number;
    emisionDirecta: number;
    totalEmisionesDirectas: number;
    emisionGEI: number;
    // anioId: number;
    sedeId: number;
    periodoCalculoId: number;
}

export interface TransporteCasaTrabajoCalcRequest {
    sedeId: number;
    from: string;
    to: string;
}

export interface TransporteCasaTrabajoCalcResponse {
    rn: number;
    id: number;
    grupoTransporteCasaTrabajoId: number;
    periodoCalculoId: number;
    sedeId: number;
    cantidadTotal: string;
    totalGEI: string;
    grupoTransporteCasaTrabajo: string;
    sede: string;
    factoresEmision: FactoresEmision[];
    factoresEmisionString: string;
}

export interface FactoresEmision {
    anio: string;
    factor: number;
}
