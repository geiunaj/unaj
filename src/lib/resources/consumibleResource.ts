export interface Datum {
    id: number;
    tipoConsumibleId: number;
    sedeId: number;
    anioId: number;
    mesId: number;
    anio_mes: number;
    pesoTotal: number;
    created_at: Date;
    updated_at: Date;
    tipoConsumible: TipoConsumible;
    mes: Anio;
    anio: Anio;
    sede: Sede;
}

export interface Anio {
    id: number;
    nombre: string;
    created_at: Date;
    updated_at: Date;
}

export interface Sede {
    id: number;
    name: string;
}

export interface TipoConsumible {
    id: number;
    nombre: string;
    unidad: string;
    descripcionId: number;
    categoriaId: number;
    grupoId: number;
    procesoId: number;
    created_at: Date;
    updated_at: Date;
}

export function formatConsumible(consumible: any) {
    const {
        created_at,
        updated_at,
        tipoConsumible,
        mes,
        anio,
        sede,
        ...rest
    } = consumible;

    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        tipoConsumible: tipoConsumible.nombre,
        descripcion: tipoConsumible.descripcion.nombre,
        categoria: tipoConsumible.categoria.nombre,
        grupo: tipoConsumible.grupo.nombre,
        proceso: tipoConsumible.proceso.nombre,
        unidad: tipoConsumible.unidad,
        mes: mes.nombre,
        anio: anio.nombre,
        sede: sede.name,
    };
}
