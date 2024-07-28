export interface FertilizanteCalc {
    tipofertilizanteId: number;
    consumoTotal: number;
    cantidadAporte: number,
    emisionDirecta: number,
    // porcentajeNitrogeno: number;
    totalEmisionesDirectas: number,
    emisionGEI: number,
    anioId: number;
    sedeId: number;
}


export interface FertilizanteCalcRequest {
    sedeId: number;
    anioId: number;

    
}

export interface FertilizanteCalcResponse {
    id: number;
    tipofertilizanteId: number;
    anioId: number;
    sedeId: number;
    tipofertilizante: string;
    unidad: string;
    porcentajeNitrogeno: number;
    consumoTotal: number; //consumo
    cantidadAporte: number;//calculado
    emisionDirecta: number;
    totalEmisionesDirectas: number;
    emisionGEI: number;

}
