export interface consumoPapelCalculosCollection {
    data: ConsumoPapelCalculoResponse[];
    meta: Meta;
}

interface Meta {
    page: number;
    perPage: number;
    totalPages: number;
    totalRecords: number;
}

export interface ConsumoPapelCalculo {
}

export interface ConsumoPapelCalculoRequest {
    sedeId: number;
    from: string;
    to: string;
}

export interface ConsumoPapelCalculoResponse {
    id: number;
    tipoPapel_id: number;
    period_id: number;
    sede_id: number;
    tipoPapel: string;
    sede: string;
    consumo: string;
    totalGEI: string;
    factoresEmision: FactoresEmision[];
    factoresEmisionString: string;
    rn: number;
}

export interface FactoresEmision {
    anio: string;
    factor: number;
}