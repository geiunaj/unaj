export interface CombustibleCalculo {
    id: number;
    tipoCombustibleId: number;
    consumoTotal: number;
    valorCalorico: number;
    consumo: number;
    emisionCO2: number;
    emisionCH4: number;
    emisionN2O: number;
    totalGEI: number;
    anioId: number;
    sedeId: number;
    created_at: Date;
    updated_at: Date;
    tipoCombustible: TipoCombustible;
    sede: Sede;
    anio: Anio;
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

export interface TipoCombustible {
    id: number;
    nombre: string;
    abreviatura: string;
    unidad: string;
    valorCalorico: number;
    factorEmisionCO2: number;
    factorEmisionCH4: number;
    factorEmisionN2O: number;
    created_at: Date;
    updated_at: Date;
}


export function formatCombustibleCalculo(combustibleCalculo: any) {
    const {
        tipoCombustible,
        consumo,
        consumoTotal,
        valorCalorico,
        emisionCO2,
        emisionCH4,
        emisionN2O,
        totalGEI,
        ...rest
    } = combustibleCalculo;

    return {
        ...rest,
        tipoCombustible: tipoCombustible.nombre,
        unidad: tipoCombustible.unidad,
        cantidad: Number(consumoTotal.toFixed(5)),
        valorCalorico: valorCalorico,
        consumo: Number(consumo.toFixed(5)),
        emisionCO2: Number(emisionCO2.toFixed(5)),
        emisionCH4: Number(emisionCH4.toFixed(5)),
        emisionN2O: Number(emisionN2O.toFixed(5)),
        totalGEI: Number(totalGEI.toFixed(5)),
        created_at: undefined,
        updated_at: undefined,
    };
}
