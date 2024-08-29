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
    factorId: number;
    consumoTotal: number;
    emisionCO2: number;
    emisionCH4: number;
    emisionN2O: number;
    totalGEI: number;
    anio: string;
    sede: string;
    area: string;
    factorCOS: number;
    factorCH4: number;
    factorN2O: number;
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
