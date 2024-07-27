export interface FertilizanteCalc {
    fertilizanteId: number;
    cantidadAporte: number,
    factorEmisionId: number,
    emisionDirecta: number,
    totalEmisionesDirectas: number,
    emisionGEI: number,
    anioId: number;
    sedeId: number;
}

export interface FertilizanteCalcRequest {
    sedeId: number;
    anioId: number;
    fertilizanteId: number;
    cantidad: number;
    factorEmisionId: number;
    
}

export interface FertilizanteCalcResponse {
    id: number;
    tipofertilizante: string;
    unidad: string;
    porcentajeNitrogeno: number;
    cantidad: number;
    cantidadAporte: number;
    factorEmision: number;
    emisionDirecta: number;
    totalEmisionesDirectas: number;
    emisionGEI: number;
    anioId: number;
    sedeId: number;
}}
