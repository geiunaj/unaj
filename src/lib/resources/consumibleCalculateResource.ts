export interface Datum {
    id: number;
    tipoConsumibleId: number;
    periodoCalculoId: number;
    sedeId: number;
    pesoTotal: number;
    totalGEI: number;
    tipoConsumible: TipoConsumible;
    sede: Sede;
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
    descripcion: Categoria;
    categoria: Categoria;
    grupo: Categoria;
    proceso: Categoria;
}

export interface Categoria {
    id: number;
    nombre?: string;
    created_at: Date;
    updated_at: Date;
    descripcion?: string;
}

export function formatConsumibleCalculo(combustibleCalculo: any) {
    const {
        created_at,
        updated_at,
        tipoConsumible,
        sede,
        pesoTotal,
        totalGEI,
        ...rest
    } = combustibleCalculo;

    return {
        ...rest,
        created_at: undefined,
        updated_at: undefined,
        pesoTotal: pesoTotal.toFixed(3),
        totalGEI: totalGEI.toFixed(3),
        tipoConsumible: tipoConsumible.nombre,
        descripcion: tipoConsumible.descripcion.nombre,
        categoria: tipoConsumible.categoria.nombre,
        grupo: tipoConsumible.grupo.nombre,
        proceso: tipoConsumible.proceso.nombre,
        unidad: tipoConsumible.unidad,
    };
}