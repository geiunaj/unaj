export interface Datum {
    id: number;
    tipoActivoId: number;
    periodoCalculoId: number;
    sedeId: number;
    pesoTotal: number;
    totalGEI: number;
    tipoActivo: TipoActivo;
    sede: Sede;
}

export interface Sede {
    id: number;
    name: string;
}

export interface TipoActivo {
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

export function formatActivoCalculo(combustibleCalculo: any) {
    const {
        created_at,
        updated_at,
        tipoActivo,
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
        tipoActivo: tipoActivo.nombre,
        descripcion: tipoActivo.descripcion.nombre,
        categoria: tipoActivo.categoria.nombre,
        grupo: tipoActivo.grupo.nombre,
        proceso: tipoActivo.proceso.nombre,
        unidad: tipoActivo.unidad,
    };
}