// lib/resources/combustibleResource.ts
type TipoCombustible = {
    id: number;
    nombre: string;
    abreviatura: string;
    unidad: string;
    created_at: Date;
    updated_at: Date;
};

type Mes = {
    id: number;
    nombre: string;
    created_at: Date;
    updated_at: Date;
};

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

type Combustible = {
    id: number;
    tipo: string;
    tipoEquipo: string;
    consumo: number;
    tipoCombustible_id: number;
    mes_id: number;
    anio_id: number;
    sede_id: number;
    created_at: Date;
    updated_at: Date;
    tipoCombustible?: TipoCombustible;
    mes?: Mes;
    anio?: Anio;
    sede?: Sede;
};

export function formatCombustible(combustible: any) {
    const {
        created_at,
        updated_at,
        tipoCombustible,
        mes,
        anio,
        sede,
        consumo,
        tipo,
        ...rest
    } = combustible;

    return {
        ...rest,
        updated_at: undefined,
        consumo: Number(consumo.toFixed(2)),
        tipoCombustible_id: undefined,
        mes_id: undefined,
        anio_id: undefined,
        sede_id: undefined,
        mes: mes?.nombre,
        anio: Number(anio?.nombre),
        tipoCombustible: tipoCombustible?.nombre,
        unidad: tipoCombustible?.unidad,
        sede: sede?.name,
        tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    };
}
