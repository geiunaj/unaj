export interface FertilizanteCalculo {
    id: number;
    fertilizanteId: number;
    unidad: string;
    consumoTotal: number; //consumo
    cantidadAporte: number;
    factorEmisionId: number;
    factorEmision: number;
    emisionDirecta: number;
    totalEmisionesDirectas: number;
    emisionGEI: number;
    anioId: number;
    sedeId: number;
    created_at: Date;
    updated_at: Date;
    sede: Sede;
    anio: Anio;
    fertilizante: Fertilizante;

}

export interface Fertilizante {
    id: number;
    cantidad: number;
    tipoFertilizanteId: number;
    tipoFertilizante: TipoFertilizante;
    created_at: Date;
    updated_at: Date;
}

export interface TipoFertilizante {
    id: number;
    nombre: string;
    clase: string;
    unidad: string;
    porcentajeNitrogeno: number;
    created_at: Date;
    updated_at: Date;
}

export interface FactorEmision {
    id: number;
    valor: string;
    created_at: Date;
    updated_at: Date;
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




export function formatFertilizanteCalculo(fertilizanteCalculo: any) {
    const {
        Fertilizante,
        cantidadAporte,
        factorEmisionId,
        emisionDirecta,
        totalEmisionesDirectas,
        emisionGEI,
        ...rest
    } = fertilizanteCalculo;

    return {
        ...rest,
        consumo: Fertilizante.consumoTotal,
        tipoFertilizante: Fertilizante.tipoFertilizante.nombre,
        unidad: Fertilizante.tipoFertilizante.unidad,
        clase: Fertilizante.tipoFertilizante.clase,
        porcentajeNitrogeno: Fertilizante.tipoFertilizante.porcentajeNitrogeno,
        cantidadAporte: Number(cantidadAporte.toFixed(5)),
        factorEmisionId: factorEmisionId,
        emisionDirecta: Number(emisionDirecta.toFixed(5)),
        totalEmisionesDirectas: Number(totalEmisionesDirectas.toFixed(5)),
        emisionGEI: Number(emisionGEI.toFixed(5)),
        created_at: undefined,
        updated_at: undefined,
    };
    
}
