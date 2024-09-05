export interface CreateCombustionProps {
    tipo: string;
    onClose: () => void;
}

export interface UpdateCombustionProps {
    id: number;
    tipo: string;
    onClose: () => void;
}

// PARA EL INDEX
export interface CombustionCollection {
    data: CombustionCollectionItem[];
    meta: Meta;
}

export interface CombustionCollectionItem {
    id: number;
    tipo: string;
    tipoEquipo: string;
    consumo: number;
    mes: string;
    anio: number;
    tipoCombustible: string;
    unidad: string;
    sede: string;
    rn: number;
}

export interface Meta {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
}

// PARA EL SHOW
export interface CombustionResource {
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
    tipoCombustible: TipoCombustible;
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

// PARA EL STORE Y UPDATE
export interface CombustionRequest {
    tipo: string;
    tipoEquipo: string;
    consumo: number;
    sede_id: number;
    tipoCombustible_id: number;
    mes_id: number;
    anio_id: number;
}

export interface CombustionType {
    tipo: "estacionaria" | "movil";
}

export interface CombustionProps {
    combustionType: CombustionType;
}