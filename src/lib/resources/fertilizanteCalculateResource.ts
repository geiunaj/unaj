export interface Main {
    id:                     number;
    tipofertilizanteId:     number;
    consumoTotal:           number;
    cantidadAporte:         number;
    emisionDirecta:         number;
    totalEmisionesDirectas: number;
    emisionGEI:             number;
    anioId:                 number;
    sedeId:                 number;
    created_at:             Date;
    updated_at:             Date;
    TipoFertilizante:       TipoFertilizante;
}

export interface TipoFertilizante {
    id:                  number;
    clase:               Clase;
    nombre:              string;
    porcentajeNitrogeno: number;
    unidad:              string;
    created_at:          Date;
    updated_at:          Date;
}

export enum Clase {
    Orgánico = "Orgánico",
    Sintético = "Sintético",
}



export function formatFertilizanteCalculo(fertilizanteCalculo: any) {
    const {
        tipofertilizanteId,
        consumoTotal,
        cantidadAporte,
        emisionDirecta,
        totalEmisionesDirectas,
        emisionGEI,
        anioId,
        sedeId,
        sede,
        TipoFertilizante: TipoFertilizante,
        
        ...rest
    } = fertilizanteCalculo;

    return {
        ...rest,
        consumo: consumoTotal,
        tipoFertilizante: TipoFertilizante.nombre,
        unidad: TipoFertilizante.unidad,
        clase: TipoFertilizante.clase,
        porcentajeNitrogeno: Number(TipoFertilizante.porcentajeNitrogeno.toFixed(5)),
        cantidadAporte: Number(cantidadAporte.toFixed(5)),
        emisionDirecta: Number(emisionDirecta.toFixed(5)),
        totalEmisionesDirectas: Number(totalEmisionesDirectas.toFixed(5)),
        emisionGEI: Number(emisionGEI.toFixed(5)),
        sede: sede.name,
        created_at: undefined,
        updated_at: undefined,
        anio: undefined,
    };
    
}
