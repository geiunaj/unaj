export interface electricidadCalculosCollection {
    data: electricidadCalculosResource[];
    meta: Meta;
}

interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface electricidadCalculosResource {
    id: number;
    consumoArea: number;
    factorConversion: number;
    consumoTotal: number;
    emisionCO2: number;
    emisionCH4: number;
    emisionN2O: number;
    totalGEI: number;
    periodoCalculoId: number;
    area: string;
}

export interface electricidadCalculosRequest {
    areaId: number;
    consumoTotal: number;
    factorConversion: number;
    consumo: number;
    emisionCO2: number;
    emisionCH4: number;
    emisionN2O: number;
    totalGEI: number;
}

export interface electricidadCalculosDetailRequest {
    areaId: number;
    consumoTotal: number;
    factorConversion: number;
    consumo: number;
    emisionCO2: number;
    emisionCH4: number;
    emisionN2O: number;
    totalGEI: number;
}

export interface ElectricidadCalcRequest {
    sedeId: number;
    from: string;
    to: string;
//   page?: number;
}

interface Meta {
    total: number;
    page: number;
    lastPage: number;
    totalRecords: number;
}
