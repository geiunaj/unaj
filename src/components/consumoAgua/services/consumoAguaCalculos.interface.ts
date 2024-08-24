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