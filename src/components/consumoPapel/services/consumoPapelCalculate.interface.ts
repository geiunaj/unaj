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
    gramaje: number;
    cantidad: number;
    consumo: number;
    period_id: number;
    sede_id: number;
    totalGEI: number;
    tipoPapel: string;
    porcentajeReciclado: number;
    porcentajeVirgen: number;
    sede: string;
    rn: number;
}
