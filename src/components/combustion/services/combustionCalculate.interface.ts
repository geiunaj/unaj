export interface CombustionCalc {
    tipo: string;
    tipoCombustibleId: number;
    consumoTotal: number;
    valorCalorico: number;
    consumo: number;
    emisionCO2: number;
    emisionCH4: number;
    emisionN2O: number;
    totalGEI: number;
    anioId: number;
    sedeId: number;
}

export interface CombustionCalcRequest {
    sedeId: number;
    anioId: number;
    tipo: string;
    // combustibleId: number;
}

export interface CombustionCalcResponse {
    id: number;
    tipo: string;
    tipoCombustibleId: number;
    anioId: number;
    sedeId: number;
    tipoCombustible: string;
    unidad: string;
    cantidad: number;
    valorCalorico: number;
    consumo: number;
    emisionCO2: number;
    emisionCH4: number;
    emisionN2O: number;
    totalGEI: number;
}