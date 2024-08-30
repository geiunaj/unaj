export interface combustionCalculosCollection {
    data: CombustionCalcResponse[];
    meta: Meta;
}

interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface combustionCalculosResource {
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
    tipo: string;
    sedeId: number;
    from?: string;
    to?: string;
}

export interface CombustionCalculosRequest {
    tipo: string;
    tipoCombustibleId: number;
    consumoTotal: number;
    valorCalorico: number;
    consumo: number;
    emisionCO2: number;
    emisionCH4: number;
    emisionN2O: number;
    totalGEI: number;
    periodoCalculoId: number;
    sedeId: number;
}

export interface CombustionCalcResponse {
    id: number;
    tipo: string;
    tipoCombustibleId: number;
    sedeId: number;
    periodoCalculoId: number;
    tipoCombustible: string;
    unidad: string;
    cantidad: number;
    valorCalorico: number;
    consumo: number;
    emisionCO2: number;
    emisionCH4: number;
    emisionN2O: number;
    totalGEI: number;
    sede: string;
}