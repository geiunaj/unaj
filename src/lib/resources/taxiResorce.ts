type Anio = {
    id: number;
    nombre: string;
    created_at: Date;
    updated_at: Date;
};

type Sede = {
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
};

type Mes = {
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
};

type Taxi = {
    id: number;
    unidadContratante: string;
    lugarSalida: string;
    lugarDestino: string;
    montoGastado: number;
    anio_id: number;
    mes_id: number;
    sede_id: number;
    created_at: Date;
    updated_at: Date;
    anio?: Anio;
    sede?: Sede;
    mes?: Mes;
};


export function formatTaxi(taxi: any) {
    const {
        id,
        unidadContratante,
        lugarSalida,
        lugarDestino,
        montoGastado,
        anio_id,
        mes_id,
        sede_id,
        created_at,
        updated_at,
        anio,
        mes,
        sede,
    } = taxi;

    return {
        id,
        unidadContratante,
        lugarSalida,
        lugarDestino,
        montoGastado,
        anio_id,
        sede_id,
        mes_id,
        created_at,
        updated_at,
        mes: mes?.nombre ?? "",
        anio: anio?.nombre ?? "",
        sede: sede?.name ?? "",
    };
}
